import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SocialAuthRepoService } from '../../../repositories/user/social-auth-repo.service';
import { GoogleService } from '../../integrations/google/google.service';
import { SiteSettingRepoService } from '../../../repositories/site-setting/site-setting-repo.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [
    AuthService,
    GoogleService,
    SocialAuthRepoService,
    AuthResolver,
    SiteSettingRepoService,
  ],
  exports: [AuthService, GoogleService],
})
export class AuthModule {}
