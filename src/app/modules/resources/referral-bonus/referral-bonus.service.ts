import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { ReferralBonusType } from '../../../repositories/referral-bonus/referral-bonus-repo.interface';

@Injectable()
export class ReferralBonusService {
  constructor(private readonly db: DatabaseService) {}

  async paginatePartnerBonuses(userId: number, page: number, perPage: number) {
    const data = await this.db.paginate({
      model: 'referralBonus',
      query: {
        where: {
          partner_id: userId,
        },
        orderBy: {
          id: 'desc',
        },
        include: {
          referral: true,
        },
      },
      page: page,
      limit: perPage,
    });

    console.log(data);
  }

  async getPartnerStatistics(userId: number) {
    const queryResults = await this.db.$queryRaw`
        SELECT
            COALESCE(SUM(CASE WHEN type = ${ReferralBonusType.COMMISSION} THEN amount ELSE -amount END), 0) AS balance,
            COALESCE(SUM(CASE WHEN type = ${ReferralBonusType.COMMISSION} THEN amount ELSE 0 END), 0) AS total,
            (SELECT COUNT(id) FROM users WHERE referrer_id = ${userId}) AS referrals_count
        FROM referral_bonuses
        WHERE partner_id = ${userId}`;

    return {
      balance: queryResults[0]?.balance ?? 0,
      totalEarnings: queryResults[0]?.total ?? 0,
      referralsCount: String(queryResults[0]?.referrals_count) ?? 0,
    };
  }
}
