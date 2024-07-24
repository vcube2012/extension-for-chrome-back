import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SocialAuthUserEntity } from '../../common/auth/entity/social-auth-user.entity';

@Injectable()
export class GoogleService {
  private readonly client: OAuth2Client;
  private readonly logger = new Logger('google');

  constructor(private readonly configService: ConfigService) {
    this.client = new OAuth2Client(
      this.configService.get<string>('google.clientID'),
      this.configService.get<string>('google.clientSecret'),
      this.configService.get<string>('google.callbackURL'),
    );
  }

  async getAuthUrl(): Promise<string> {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: this.configService.get<string>('google.scopes'),
    });
  }

  async getUser(code: string): Promise<SocialAuthUserEntity> {
    try {
      const result = await this.client.getToken(code);

      const loginTicket = await this.client.verifyIdToken({
        idToken: result.tokens.id_token,
        audience: this.configService.get<string>('google.clientID'),
      });

      const googlePayload = await loginTicket?.getPayload();

      if (!googlePayload?.email) {
        new Error('Email is required');
      }

      return {
        email: googlePayload.email,
        first_name: googlePayload.given_name,
        last_name: googlePayload.family_name,
        avatar: googlePayload.picture,
        password: googlePayload.sub,
      };
    } catch (e) {
      this.logger.error(e.message);

      throw new InternalServerErrorException('Google authorization error');
    }
  }
}
