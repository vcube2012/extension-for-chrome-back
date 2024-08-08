import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { TagEntity } from './entity/tag.entity';
import { IContextServer } from '../../common/graphql/graphql.module';
import { SaveTagsInput } from './input/save-tags.input';
import { TagService } from './tag.service';
import { RequestedFieldsDecorator } from '../../../decorators/requested-fields.decorator';
import { Prisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Resolver()
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [TagEntity])
  @ExceptionHandlerDecorator()
  async getTags(
    @Context() ctx: IContextServer,
    @RequestedFieldsDecorator() fields: Prisma.TagSelect,
  ) {
    return this.tagService.findAllForUser(ctx.req.user.id, fields);
  }

  @Mutation(() => [TagEntity])
  @ExceptionHandlerDecorator()
  async addTag(
    @Context() ctx: IContextServer,
    @Args('input') input: SaveTagsInput,
  ) {
    return this.tagService.saveTagsForFavoriteAddress(ctx.req.user.id, input);
  }
}
