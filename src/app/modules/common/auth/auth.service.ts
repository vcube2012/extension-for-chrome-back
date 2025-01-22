import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocialAuthRepoService } from '../../../repositories/user/social-auth-repo.service';
import { SocialAuthUserEntity } from './entity/social-auth-user.entity';
import { DatabaseService } from '../../globals/database/database.service';
import { compareSync, hashSync } from 'bcrypt';
import { SocialAuthType } from '../../../repositories/user/user-repo.interface';
import { faker } from '@faker-js/faker';
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

  async socialSignIn(
    code: string,
    type: SocialAuthType,
    referralToken: string | null = null,
  ): Promise<string> {
    const socialUser = await this.socialAuthService.getUser(code, type);

    if (!socialUser) {
      throw new InternalServerErrorException(
        'Google service unavailable. Try later',
      );
    }

    let userExists = await this.findUserByEmail(socialUser.email);

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
      userExists = await this.createSocialUser(socialUser, referralToken);
    }

    return this.createToken({
      id: userExists.id,
      email: userExists.email,
    });
  }

  private async createSocialUser(
    socialAuthUserEntity: SocialAuthUserEntity,
    referralToken?: string,
  ): Promise<UserEntity> {
    let referrerId = null;

    if (!!referralToken) {
      const referrer: UserEntity = await this.db.user.findUnique({
        where: {
          username: referralToken,
        },
      });

      if (!!referrer?.id) {
        referrerId = referrer.id;
      }
    }

    return this.db.user.create({
      data: {
        email: socialAuthUserEntity.email,
        first_name: socialAuthUserEntity.first_name,
        last_name: socialAuthUserEntity.last_name,
        password: hashSync(socialAuthUserEntity.password, 10),
        avatar: socialAuthUserEntity.avatar,
        username: faker.string.uuid(),
        referrer_id: referrerId,
      },
    });
  }

  private async createToken(payload: JwtPayloadInterface) {
    return this.jwtService.signAsync(payload);
  }

  private async findUserByEmail(email: string): Promise<UserEntity> {
    return this.db.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
