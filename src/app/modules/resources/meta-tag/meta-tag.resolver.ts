import { Args, Query, Resolver } from '@nestjs/graphql';
import { MetaTagEntity } from './entity/meta-tag.entity';
import { MetaTagService } from './meta-tag.service';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { FindOneMetaTagInput } from './inputs/find-one-meta-tag.input';

@Resolver()
export class MetaTagResolver {
  constructor(private readonly metaTagService: MetaTagService) {}

  @Query(() => MetaTagEntity, { nullable: true })
  @ExceptionHandlerDecorator()
  async findMetaTags(@Args('input') input: FindOneMetaTagInput) {
    return this.metaTagService.findOne(input.url);
  }
}
