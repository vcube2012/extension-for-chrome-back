import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocialAuthRepoService } from '../../../repositories/user/social-auth-repo.service';
import { SocialSignInInput } from './dto/social-sign-in.input';
import { SocialAuthUserEntity } from './entity/social-auth-user.entity';
import { DatabaseService } from '../../globals/database/database.service';
import { compareSync, hashSync } from 'bcrypt';

interface JwtPayloadInterface {
  id: number | string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly socialAuthService: SocialAuthRepoService,
    private readonly db: DatabaseService,
    private jwtService: JwtService,
  ) {}
  async socialSignIn(input: SocialSignInInput): Promise<string> {
    const socialUser = await this.socialAuthService.getUser(
      input.code,
      input.type,
    );

    if (!socialUser) {
      throw new InternalServerErrorException(
        'Google service unavailable. Try later',
      );
    }

    let userExists = await this.checkIfUserExists(socialUser.email);

    if (userExists) {
      const isMatch = compareSync(socialUser.password, userExists.password);

      if (!isMatch) {
        throw new BadRequestException('Invalid credentials');
      }

      await this.db.user.update({
        where: {
          id: userExists.id,
        },
        data: {
          first_name: socialUser.first_name,
          last_name: socialUser.last_name,
          avatar: socialUser.avatar,
        },
      });
    } else {
      userExists = await this.createSocialUser(socialUser);
    }

    return this.createToken({
      id: userExists.id,
      email: userExists.email,
    });
  }

  private async createSocialUser(socialAuthUserEntity: SocialAuthUserEntity) {
    return this.db.user.create({
      data: {
        email: socialAuthUserEntity.email,
        first_name: socialAuthUserEntity.first_name,
        last_name: socialAuthUserEntity.last_name,
        password: hashSync(socialAuthUserEntity.password, 10),
        avatar: socialAuthUserEntity.avatar,
      },
    });
  }

  private async createToken(payload: JwtPayloadInterface) {
    return this.jwtService.signAsync(payload);
  }

  private async checkIfUserExists(email: string) {
    return this.db.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
