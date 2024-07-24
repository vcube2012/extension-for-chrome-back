import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocialAuthRepoService } from '../../repositories/user/social-auth-repo.service';
import { SocialSignInInput } from './dto/social-sign-in.input';
import { SocialAuthUserEntity } from './entity/social-auth-user.entity';
import { DatabaseService } from '../../globals/database/database.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../resources/user/entity/user.entity';

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
  async socialSignIn(input: SocialSignInInput) {
    const socialUser = await this.socialAuthService.getUser(
      input.code,
      input.type,
    );

    if (!socialUser) {
      throw new BadRequestException('Unauthenticated');
    }

    let userExists = await this.checkIfUserExists(socialUser.email);

    if (userExists) {
      const hashPassword = await this.hash(socialUser.password);
      const isMatch = await bcrypt.compare(userExists.password, hashPassword);

      if (!isMatch) {
        throw new BadRequestException('Unauthenticated');
      }
    } else {
      userExists = await this.createSocialUser(socialUser);
    }

    const token = await this.createToken({
      id: userExists.id,
      email: userExists.email,
    });

    return token;
  }

  private async createSocialUser(socialAuthUserEntity: SocialAuthUserEntity) {
    return this.db.user.create({
      data: {
        email: socialAuthUserEntity.email,
        first_name: socialAuthUserEntity.first_name,
        last_name: socialAuthUserEntity.last_name,
        password: await this.hash(socialAuthUserEntity.password),
        avatar: socialAuthUserEntity.avatar,
      },
    });
  }

  private async hash(data: string, saltOrRounds: string | number = 10) {
    return bcrypt.hash(data, saltOrRounds);
  }

  private async createToken(payload: JwtPayloadInterface) {
    return this.jwtService.signAsync(payload);
  }

  private async checkIfUserExists(email: string): Promise<UserEntity> {
    return this.db.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
