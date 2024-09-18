import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SocialAuthType } from '../../../repositories/user/user-repo.interface';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google/callback')
  @ExceptionHandlerDecorator()
  async handleGoogleCallback(
    @Query('code') code?: string,
    @Query('error') error?: string,
  ) {
    if (!code) {
      throw new BadRequestException('Code not found');
    }

    if (error) {
      throw new InternalServerErrorException(
        `Google authorization error: ${error}`,
      );
    }

    const token = await this.authService.socialSignIn(
      code,
      SocialAuthType.GOOGLE,
    );

    return {
      token: token,
    };
  }
}
