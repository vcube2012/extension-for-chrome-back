import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../resources/user/user.service';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly google: OAuth2Client;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.google = new OAuth2Client(
      this.configService.get<string>('google.clientID'),
      this.configService.get<string>('google.clientSecret'),
      this.configService.get<string>('google.callbackURL'),
    );
  }

  async getAuthorizedUrl() {
    return this.google.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });
  }

  async googleSignIn(token: string): Promise<LoginTicket> {
    try {
      const user = await this.google.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('google.clientID'),
      });

      if (!user?.getPayload()?.email) {
        new Error('Email is required');
      }

      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
