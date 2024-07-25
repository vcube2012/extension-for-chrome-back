import { Context, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { UserService } from './user.service';
import { IContextServer } from '../../common/graphql/graphql.module';
import { UserEntity } from './entity/user.entity';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => UserEntity)
  async getProfile(@Context() ctx: IContextServer) {
    return this.userService.findOneById(ctx.req.user.id);
  }
}
