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
  abstract handleSubscriptionCreated(data: any);

  // Unsubscribe user from current subscription
  abstract unsubscribe(subscriptionId: any);

  // When package price was updated from admin panel
  abstract handlePackageUpdate(packageId: number);

  // When package was deleted or deactivated from admin panel
  abstract unsubscribeAllUsersFromPackage(packageId: number);

  // When package was activated from admin panel
  abstract activateProduct(packageId: number);

  // Webhook for successful payment
  abstract handleSuccessfullyPayment(data: any);

  // Webhook for failed payment
  abstract handleFailedPayment(data: any);

  async unsubscribeByPaymentId(paymentId: string) {
    await this.unsubscribe(paymentId);
  }

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
    paymentId: string | null = null,
  ): Promise<DepositEntity> {
    const data = {
      status: DepositStatus.FAILED,
      error: error,
    };

    if (!!paymentId) {
      data['payment_id'] = paymentId;
    }

    return this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        ...data,
      },
    });
  }

  async setNewPackageForUser(
    subscribePlan: PackageEntity,
    user: UserEntity,
    isTrial: boolean,
  ): Promise<UserEntity> {
    const date = this.getDateForSubscriptionPlan(subscribePlan.type);

    const packageUser: PackageUserEntity = await this.db.packageUser.create({
      data: {
        user_id: user.id,
        package_id: subscribePlan.id,
        is_active: true,
        is_trial: isTrial,
        credits: subscribePlan.credits,
        price: subscribePlan.price,
        available_to: date,
        created_at: moment().toDate(),
      },
    });

    await this.db.packageUser.updateMany({
      where: {
        id: {
          not: packageUser.id,
        },
      },
      data: {
        is_active: false,
      },
    });

    return this.earnCredits(user.id, subscribePlan);
  }

  async earnCredits(
    userId: number,
    subscribePlan: PackageEntity,
  ): Promise<UserEntity> {
    const date = this.getDateForSubscriptionPlan(subscribePlan.type);

    return this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {
          increment: subscribePlan.credits,
        },
        package_available_to: date,
        unsubscribed: false,
      },
    });
  }

  getDateForSubscriptionPlan(period: string): Date {
    let date: any = moment();

    if (period === PackageType.MONTHLY) {
      date = date.add(1, 'month').toDate();
    } else {
      date = date.add(1, 'year').toDate();
    }

    return date;
  }
}
