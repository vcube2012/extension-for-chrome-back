import { Context, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { UserService } from './user.service';
import { IContextServer } from '../../common/graphql/graphql.module';
import { UserEntity } from './entity/user.entity';
import { RequestedFieldsDecorator } from '../../decorators/requested-fields.decorator';
import { Prisma } from '@prisma/client';
import { ExceptionHandlerDecorator } from '../../decorators/exception-handler.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => UserEntity, { nullable: true })
  @ExceptionHandlerDecorator()
  async getProfile(
    @Context() ctx: IContextServer,
    @RequestedFieldsDecorator()
    fields: Prisma.UserSelect,
  ) {
    return this.userService.findOneById(ctx.req.user.id, fields);
  }
}
