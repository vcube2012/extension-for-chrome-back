import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { ExceptionHandlerDecorator } from '../../decorators/exception-handler.decorator';
import { TagEntity } from './entity/tag.entity';
import { IContextServer } from '../../common/graphql/graphql.module';
import { SaveTagsInput } from './dto/save-tags.input';
import { TagService } from './tag.service';

@UseGuards(AuthGuard)
@Resolver()
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => [TagEntity])
  @ExceptionHandlerDecorator()
  async addTag(
    @Context() ctx: IContextServer,
    @Args('input') input: SaveTagsInput,
  ) {
    return this.tagService.saveTagsForFavoriteAddress(ctx.req.user.id, input);
  }
}
