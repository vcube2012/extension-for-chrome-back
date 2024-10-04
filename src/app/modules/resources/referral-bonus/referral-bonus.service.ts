import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import {
  ReferralBonusType,
  WithdrawalStatus,
} from '../../../repositories/referral-bonus/referral-bonus-repo.interface';
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
  ReferralBonusEntity,
} from './entity/referral-bonus.entity';

@Injectable()
export class ReferralBonusService {
  constructor(
    private readonly db: DatabaseService,
    private readonly settingService: SiteSettingRepoService,
  ) {}

  async withdraw(
    userId: number,
    amount: number,
    creditCard: string,
  ): Promise<ReferralBonusEntity> {
    const user: UserEntity = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });

    const queryResults = await this.db.$queryRaw`
      SELECT 
          COALESCE(SUM(CASE WHEN type = ${ReferralBonusType.COMMISSION} THEN amount ELSE -amount END), 0)
              AS balance 
      FROM referral_bonuses 
      WHERE partner_id = ${userId}`;

    const userBalance = queryResults[0]?.balance ?? 0;

    if (userBalance <= amount) {
      throw new BadRequestException(
        'You do not have enough funds in your balance',
      );
    }

    const partnerPercent = await this.getPartnerPercent(user);

    return this.db.referralBonus.create({
      data: {
        type: ReferralBonusType.WITHDRAWAL,
        partner_id: userId,
        amount: amount,
        credit_card: creditCard,
        percent: partnerPercent,
        withdrawal_status: WithdrawalStatus.REQUESTED,
      },
    });
  }

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
        partnerPercent: Number(user.partner_percent),
        username: user.username,
      };
    }

    const data = {};

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

    const partnerPercent = await this.getPartnerPercent(user);

    return {
      partnerPercent: partnerPercent,
      username: updatedUser.username,
    };
  }

  async getPartnerPercent(user: UserEntity): Promise<number> {
    if (!user.partner_percent) {
      const setting: PartnerBonusEntity = await this.settingService.findOne(
        SiteSettingKey.PARTNER_BONUS,
      );
      return Number(setting?.value) ?? 0;
    }

    return Number(user.partner_percent);
  }
}
