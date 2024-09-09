import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GoogleService } from '../../integrations/google/google.service';
import { SocialAuthRepoService } from '../../../repositories/user/social-auth-repo.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService, GoogleService, SocialAuthRepoService, AuthResolver],
})
export class AuthModule {}
