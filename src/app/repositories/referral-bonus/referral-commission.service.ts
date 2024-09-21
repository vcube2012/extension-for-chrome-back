import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../modules/globals/database/database.service';
import {
  PartnerEntity,
  ReferralBonusEntity,
} from '../../modules/resources/referral-bonus/entity/referral-bonus.entity';
import { ReferralBonusType } from './referral-bonus-repo.interface';

@Injectable()
export class ReferralCommissionService {
  constructor(private readonly db: DatabaseService) {}

  async calculateReferralCommission(
    partnerId: number,
    referralId: number,
    amount: number,
  ): Promise<ReferralBonusEntity> {
    const referrer: PartnerEntity = await this.db.user.findUnique({
      where: {
        id: partnerId,
      },
    });

    if (!referrer || Number(referrer.partner_percent) <= 0 || amount <= 0) {
      return;
    }

    const commission = amount * (referrer.partner_percent / 100);

    return this.db.referralBonus.create({
      data: {
        type: ReferralBonusType.COMMISSION,
        partner_id: referrer.id,
        referral_id: referralId,
        percent: referrer.partner_percent,
        amount: commission,
      },
    });
  }
}
