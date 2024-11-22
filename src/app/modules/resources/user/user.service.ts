import { DatabaseService } from '../../globals/database/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async findOneById(id: number, fields: Prisma.UserSelect) {
    const user = await this.db.user.findUniqueOrThrow({
      where: {
        id: id,
      },
      select: {
        ...fields,
        setting: {
          select: {
            data: true,
          },
        },
        _count: {
          select: {
            userPackages: true,
          },
        },
      },
    });

    if (!user.setting) {
      user.setting = await this.storeDefaultSettings(user.id);
    }

    return {
      ...user,
      can_activate_trial: user._count.userPackages <= 0,
    };
  }

  private async storeDefaultSettings(userId: number) {
    return this.db.setting.create({
      data: {
        user_id: userId,
        data: {
          use_loan: true,
          purchase_range: {
            from: 20000,
            to: 100000,
          },
          mortgage: {
            down_payment: 20,
            interest_rate: 7.5,
            loan_term: 30,
            closing_costs: 3000,
          },
          expenses: {
            property_taxes: 1200,
            insurance: 60,
            hoa_fee: 0,
            management: 10,
            maintenance: 10,
            vacancy: 5,
          },
        },
      },
    });
  }
}
