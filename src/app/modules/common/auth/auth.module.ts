import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SocialAuthRepoService } from '../../../repositories/user/social-auth-repo.service';
import { AuthController } from './auth.controller';
import { GoogleService } from '../../integrations/google/google.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleService, SocialAuthRepoService, AuthResolver],
  exports: [AuthService, GoogleService],
})
export class AuthModule {}
