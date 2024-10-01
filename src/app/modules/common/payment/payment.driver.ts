import { DatabaseService } from '../../globals/database/database.service';
import { DepositEntity } from '../../resources/deposit/entity/deposit.entity';
import { DepositStatus } from '../../../repositories/deposit/deposit-repo.interface';
import {
  PackageEntity,
  PackageUserEntity,
} from '../../resources/package/entity/package.entity';
import { UserEntity } from '../../resources/user/entity/user.entity';
import * as moment from 'moment';
import { PackageType } from '../../../repositories/package/package-repo.interface';
import { ReferralCommissionService } from '../../../repositories/referral-bonus/referral-commission.service';

export abstract class PaymentDriver {
  protected constructor(
    protected readonly db: DatabaseService,
    protected readonly referralSystem: ReferralCommissionService,
  ) {}

  // Webhook for handling subscription
  abstract handleSubscription(data: any);

  // Unsubscribe user from current subscription
  abstract unsubscribe(subscriptionId: any);

  async depositSuccess(
    deposit: DepositEntity,
    isTrial: boolean,
    paymentId: string = null,
  ): Promise<DepositEntity> {
    const updatedDeposit: DepositEntity = await this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        status: DepositStatus.SUCCESS,
        payment_id: paymentId,
      },
      include: {
        package: true,
        user: true,
      },
    });

    await this.setNewPackageForUser(
      updatedDeposit.package,
      updatedDeposit.user,
      isTrial,
    );

    if (deposit.user?.referrer_id) {
      await this.referralSystem.calculateReferralCommission(
        deposit.user.referrer_id,
        deposit.user.id,
        deposit.amount,
      );
    }

    return updatedDeposit;
  }

  async depositWaiting(
    deposit: DepositEntity,
    paymentId: string | null = null,
  ): Promise<DepositEntity> {
    return this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        status: DepositStatus.WAITING,
        payment_id: paymentId,
      },
    });
  }

  async depositFailed(
    deposit: DepositEntity,
    error: string | null = null,
  ): Promise<DepositEntity> {
    return this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        status: DepositStatus.WAITING,
        error: error,
      },
    });
  }

  private async setNewPackageForUser(
    subscribePlan: PackageEntity,
    user: UserEntity,
    isTrial: boolean,
  ): Promise<UserEntity> {
    return this.db.$transaction(async (tx): Promise<UserEntity> => {
      const unit =
        subscribePlan.type === PackageType.MONTHLY ? 'month' : 'year';

      const packageUser: PackageUserEntity = await tx.packageUser.create({
        data: {
          user_id: user.id,
          package_id: subscribePlan.id,
          is_active: true,
          is_trial: isTrial,
          credits: subscribePlan.credits,
          available_to: moment().add(1, unit).toDate(),
        },
      });

      await tx.packageUser.updateMany({
        where: {
          id: {
            not: packageUser.id,
          },
        },
        data: {
          is_active: false,
        },
      });

      let date: any = moment();

      if (subscribePlan.type === PackageType.MONTHLY) {
        date = date.add(1, 'month').toDate();
      } else {
        date = date.add(1, 'year').toDate();
      }

      return tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          credits: {
            increment: subscribePlan.credits,
          },
          package_available_to: date,
          unsubscribed: false,
        },
      });
    });
  }
}
