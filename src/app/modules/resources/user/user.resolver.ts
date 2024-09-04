import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { UserService } from './user.service';
import { IContextServer } from '../../common/graphql/graphql.module';
import { UserEntity } from './entity/user.entity';
import { RequestedFieldsDecorator } from '../../../decorators/requested-fields.decorator';
import { Prisma } from '@prisma/client';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { UserRepoService } from '../../../repositories/user/user-repo.service';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userRepoService: UserRepoService,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => UserEntity, { nullable: true })
  @ExceptionHandlerDecorator()
  async getProfile(
    @Context() ctx: IContextServer,
    @RequestedFieldsDecorator({ exclude: ['setting', 'currentPackage'] })
    fields: Prisma.UserSelect,
  ) {
    return this.userService.findOneById(ctx.req.user.id, fields);
  }

  @ResolveField()
  async currentPackage(@Parent() getProfile: UserEntity) {
    return this.userRepoService.findCurrentPackage(getProfile.id);
  }
}
