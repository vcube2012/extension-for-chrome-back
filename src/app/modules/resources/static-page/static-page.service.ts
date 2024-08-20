import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StaticPageService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(fields: Prisma.StaticPageSelect) {
    return this.db.staticPage.findMany({
      where: {
        is_active: true,
      },
      select: {
        ...fields,
      },
    });
  }
}
