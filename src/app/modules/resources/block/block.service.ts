import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { BlockPage } from './enums/block-page.enum';
import { BlockType } from './enums/block-type.enum';
import { BlockEntity } from './entity/block.entity';
import { isLogLevelEnabled } from '@nestjs/common/services/utils';
import { Prisma } from '@prisma/client';

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

  async findBlock(page: BlockPage, type: string) {
    const blocks: any[] = await this.db.$queryRaw`
        SELECT * FROM blocks
        where active = true
          AND page = '${Prisma.raw(page)}'
          AND content::jsonb -> 0 @> '{"type": "${Prisma.raw(type)}"}'
        LIMIT 1
    `;

    if (blocks.length <= 0) {
      return null;
    }

    const blockContent = blocks[0]?.content[0];

    if (!blockContent) {
      return null;
    }

    return {
      ...blocks[0],
      type: blockContent.type,
      content: this.blockContent(blockContent),
    };
  }

  private blockContent(content) {
    if (Object.values(BlockType).includes(content.type)) {
      return content.data;
    }

    throw new InternalServerErrorException(`Undefined block - ${content.type}`);
  }
}
