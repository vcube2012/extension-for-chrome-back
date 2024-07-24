import { AuthService } from './auth.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GoogleService } from '../../integrations/google/google.service';
import { SocialSignInInput } from './dto/social-sign-in.input';
import { ExceptionHandlerDecorator } from '../../decorators/exception-handler.decorator';

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

  @Mutation(() => String)
  @ExceptionHandlerDecorator()
  async socialSignIn(@Args('input') input: SocialSignInInput) {
    return this.authService.socialSignIn(input);
  }
}
