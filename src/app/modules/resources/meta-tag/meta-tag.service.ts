import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';

@Injectable()
export class MetaTagService {
  constructor(private readonly db: DatabaseService) {}

  async findOne(uri: string) {
    const clearUri = uri.replace('//', '/');

    return this.db.metaTag.findFirst({
      where: {
        OR: [{ url: clearUri }, { url: clearUri.replace(/^\/+/, '') }],
      },
    });
  }
}
