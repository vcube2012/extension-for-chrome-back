import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(fields: Prisma.FaqSelect) {
    return this.db.review.findMany({
      select: {
        ...fields,
      },
      orderBy: {
        sort_order: 'asc',
      },
    });
  }
}
