import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { DepositStatus } from '../../../repositories/deposit/deposit-repo.interface';

@Injectable()
export class DepositService {
  constructor(private readonly db: DatabaseService) {}

  async paginateDeposits(userId: number, page: number, perPage: number) {
    return this.db.paginate({
      model: 'deposit',
      query: {
        where: {
          status: DepositStatus.SUCCESS,
          user_id: userId,
        },
        include: {
          package: true,
        },
        orderBy: {
          id: 'desc',
        },
      },
      page: page,
      limit: perPage,
    });
  }
}
