import { AuthService } from './auth.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GoogleService } from '../../integrations/google/google.service';
import { SocialSignInInput } from './inputs/social-sign-in.input';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { TokenResponse } from './entity/social-auth-user.entity';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private googleService: GoogleService,
  ) {}

  @Query(() => String)
  @ExceptionHandlerDecorator()
  async getGoogleAuthUrl() {
    return this.googleService.getAuthUrl();
  }

  @Mutation(() => TokenResponse)
  @ExceptionHandlerDecorator()
  async socialSignIn(
    @Args('input') input: SocialSignInInput,
  ): Promise<TokenResponse> {
    const token = await this.authService.socialSignIn(
      input.code,
      input.type,
      input.referralToken,
    );

    return {
      token: token,
    };
  }
}
