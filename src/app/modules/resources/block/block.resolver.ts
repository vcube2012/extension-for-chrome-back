import { Query, Resolver } from '@nestjs/graphql';
import { BlockService } from './block.service';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { BlockEntity } from './entity/block.entity';
import { BlockPage } from './enums/block-page.enum';

@Resolver()
export class BlockResolver {
  constructor(private readonly blockService: BlockService) {}

  @Query(() => [BlockEntity])
  @ExceptionHandlerDecorator()
  async getHomeBlocks(): Promise<BlockEntity[]> {
    return this.blockService.findBlocksForPage(BlockPage.HOME);
  }
}
