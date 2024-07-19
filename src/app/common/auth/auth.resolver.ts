import { AuthService } from './auth.service';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => String)
  async auth() {
    return this.authService.getAuthorizedUrl();
  }
}
