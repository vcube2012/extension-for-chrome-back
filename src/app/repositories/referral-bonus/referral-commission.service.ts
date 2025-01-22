import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../modules/globals/database/database.service';
import {
  PartnerEntity,
  ReferralBonusEntity,
} from '../../modules/resources/referral-bonus/entity/referral-bonus.entity';
import { ReferralBonusType } from './referral-bonus-repo.interface';
import { SiteSettingRepoService } from '../site-setting/site-setting-repo.service';
import {
  PartnerBonusEntity,
  SiteSettingKey,
} from '../../modules/resources/site-setting/entity/site-setting.entity';

@Injectable()
export class ReferralCommissionService {
  constructor(
    private readonly db: DatabaseService,
    private readonly settingService: SiteSettingRepoService,
  ) {}

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

    let referrerPercent = referrer.partner_percent;

    if (!referrerPercent) {
      const setting: PartnerBonusEntity = await this.settingService.findOne(
        SiteSettingKey.PARTNER_BONUS,
      );

      referrerPercent = setting?.value ?? 0;
    }

    referrerPercent = Number(referrerPercent);

    if (!referrer || referrerPercent <= 0 || amount <= 0) {
      return;
    }

    const commission = amount * (referrerPercent / 100);

    return this.db.referralBonus.create({
      data: {
        type: ReferralBonusType.COMMISSION,
        partner_id: referrer.id,
        referral_id: referralId,
        percent: referrerPercent,
        amount: commission,
      },
    });
  }
}
