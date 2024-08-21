import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { CreateDepositDto } from '../../common/payment/dto/create-deposit.dto';

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

  async createDeposit(dto: CreateDepositDto) {
    // return this.db.deposit.create({
    // data: {
    //   user_id: dto.user_id,
    //   payment_system_id: dto.payment_system_id,
    //   package_id: dto.package_id,
    //   type: dto.type,
    //   amount: dto.amount,
    //   status: dto.status,
    // },
    // });
  }
}
