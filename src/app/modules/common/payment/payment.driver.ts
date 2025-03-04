import { DatabaseService } from '../../globals/database/database.service';
import { DepositEntity } from '../../resources/deposit/entity/deposit.entity';
import { DepositStatus } from '../../../repositories/deposit/deposit-repo.interface';
import { ReferralCommissionService } from '../../../repositories/referral-bonus/referral-commission.service';
import { UserPackageService } from '../../../repositories/package/user-package.service';

export abstract class PaymentDriver {
  protected constructor(
    protected readonly db: DatabaseService,
    protected readonly referralSystem: ReferralCommissionService,
    protected readonly userPackageService: UserPackageService,
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

    await this.userPackageService.setNewPackageForUser(
      updatedDeposit.package,
      updatedDeposit.user.id,
      isTrial,
    );

    if (updatedDeposit.user?.referrer_id) {
      await this.referralSystem.calculateReferralCommission(
        updatedDeposit.user.referrer_id,
        updatedDeposit.user.id,
        updatedDeposit.amount,
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
}
