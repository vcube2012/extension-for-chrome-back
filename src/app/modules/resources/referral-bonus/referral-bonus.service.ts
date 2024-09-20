import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { ReferralBonusType } from '../../../repositories/referral-bonus/referral-bonus-repo.interface';
import { SiteSettingRepoService } from '../../../repositories/site-setting/site-setting-repo.service';
import { UserEntity } from '../user/entity/user.entity';
import {
  PartnerBonusEntity,
  SiteSettingKey,
} from '../site-setting/entity/site-setting.entity';
import { faker } from '@faker-js/faker';
import {
  PaginatedReferralBonuses,
  PartnerInfoEntity,
  PartnerStatisticsEntity,
} from './entity/referral-bonus.entity';

@Injectable()
export class ReferralBonusService {
  constructor(
    private readonly db: DatabaseService,
    private readonly settingService: SiteSettingRepoService,
  ) {}

  async paginatePartnerBonuses(
    userId: number,
    page: number,
    perPage: number,
  ): Promise<PaginatedReferralBonuses> {
    return this.db.paginate({
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
  }

  async getPartnerStatistics(userId: number): Promise<PartnerStatisticsEntity> {
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
      referralsCount: queryResults[0]?.referrals_count ?? 0,
    };
  }

  async getPartnerPercentAndLink(userId: number): Promise<PartnerInfoEntity> {
    const user: UserEntity = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!!user.partner_percent && !!user.username) {
      return {
        partnerPercent: user.partner_percent,
        username: user.username,
      };
    }

    const data = {};

    if (!user.partner_percent) {
      const partnerPercent: PartnerBonusEntity =
        await this.settingService.findOne(SiteSettingKey.PARTNER_BONUS);

      data['partner_percent'] = partnerPercent.value;
    }

    if (!user.username) {
      data['username'] = faker.string.uuid();
    }

    const updatedUser: UserEntity = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
      },
    });

    return {
      partnerPercent: updatedUser.partner_percent,
      username: updatedUser.username,
    };
  }
}
