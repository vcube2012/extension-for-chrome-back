import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { BlockPage } from './enums/block-page.enum';
import { BlockType } from './enums/block-type.enum';

@Injectable()
export class BlockService {
  constructor(private readonly db: DatabaseService) {}

  async findBlocksForPage(page: BlockPage) {
    const blocks: any[] = await this.db.block.findMany({
      where: {
        page: page,
        active: true,
      },
    });

    return blocks
      .filter((block) => !!block.content[0])
      .map((block) => {
        const blockContent = block.content[0];

        return {
          ...block,
          type: blockContent.type,
          content: this.blockContent(blockContent),
        };
      });
  }

  private blockContent(content) {
    if (Object.values(BlockType).includes(content.type)) {
      return content.data;
    }

    throw new InternalServerErrorException(`Undefined block - ${content.type}`);
  }
}
