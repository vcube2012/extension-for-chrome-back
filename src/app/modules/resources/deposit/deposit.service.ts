import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/src/app/modules/globals/database/database.service';

@Injectable()
export class DepositService {
  constructor(private readonly db: DatabaseService) {}

  async paginateDeposits(userId: number, page: number, perPage: number) {
    return this.db.paginate({
      model: 'deposit',
      query: {
        include: {
          package: true,
        },
      },
      page: page,
      limit: perPage,
    });
  }
}
