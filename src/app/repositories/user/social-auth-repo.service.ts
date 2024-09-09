import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleService } from '../../modules/integrations/google/google.service';
import { SocialAuthType } from './user-repo.interface';
import { SocialAuthUserEntity } from '../../modules/common/auth/entity/social-auth-user.entity';

@Injectable()
export class SocialAuthRepoService {
  constructor(private readonly googleService: GoogleService) {}

  async getUser(
    code: string,
    type?: SocialAuthType,
  ): Promise<SocialAuthUserEntity> {
    if (!type) {
      type = SocialAuthType.GOOGLE;
    }

    if (type === SocialAuthType.GOOGLE) {
      return this.googleService.getUser(code);
    }

    throw new InternalServerErrorException(
      'Undefined type of social authentication',
    );
  }
}
