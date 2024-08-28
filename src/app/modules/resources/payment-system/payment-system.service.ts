import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';

@Injectable()
export class PaymentSystemService {
  constructor(private readonly db: DatabaseService) {}

  async findAll() {
    return this.db.paymentSystem.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        sort_order: 'asc',
      },
    });
  }
}
