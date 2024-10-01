import { BadRequestException, Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PackageEntity } from '../../resources/package/entity/package.entity';
import { UserEntity } from '../../resources/user/entity/user.entity';
import { PaymentSystemEntity } from '../../resources/payment-system/entity/payment-system.entity';
import { DatabaseService } from '../../globals/database/database.service';
import { UserRepoService } from '../../../repositories/user/user-repo.service';
import { PaymentManager } from './payment.manager';
import { PaymentUrlResponseEntity } from './entity/payment-url-response.entity';
import { WithPagePayment } from './interfaces/with-page-payment.interface';
import { WithCardPayment } from './interfaces/with-card-payment.interface';
import { PackageRepoInterface } from '../../../repositories/package/package-repo.interface';
import { DepositEntity } from '../../resources/deposit/entity/deposit.entity';
import {
  DepositStatus,
  DepositType,
} from '../../../repositories/deposit/deposit-repo.interface';
import { PaymentDriver } from './payment.driver';

interface IPaymentDataOptions {
  package: PackageEntity;
  user: UserEntity;
  data: IPaymentData;
}

interface IPaymentData {
  paymentSystemId: number;
  packageId: number;
}

interface IPaymentRequestOptions {
  userId: number;
  paymentSystemId: number;
  packageId: number;
}

@Injectable()
export class PaymentService {
  private paymentSystemEntity?: PaymentSystemEntity = null;

  constructor(
    private readonly db: DatabaseService,
    private readonly userRepoService: UserRepoService,
    private readonly paymentManager: PaymentManager,
  ) {}

  async renewPackage(userId: number, paymentSystemId: number) {
    const user: UserEntity = await this.findAuthUserWithLastPackage(userId);

    if (!user.currentPackage) {
      throw new BadRequestException("You don't have any active package!");
    }

    return this.payWithPaymentPage(
      user.id,
      paymentSystemId,
      user.currentPackage.id,
    );
  }

  // Unsubscribe from next recurring payment for current subscription
  async unsubscribe(userId: number) {
    const user: UserEntity = await this.findAuthUserWithLastPackage(userId);

    if (user.unsubscribed) {
      throw new BadRequestException('You have already unsubscribed!');
    }

    if (!user.currentPackage) {
      throw new BadRequestException("You don't have any subscriptions!");
    }

    const deposit: DepositEntity = await this.db.deposit.findFirst({
      where: {
        user_id: user.id,
        package_id: user.currentPackage.id,
        status: DepositStatus.SUCCESS,
      },
      orderBy: {
        id: 'desc',
      },
    });

    const paymentSystemEntity = await this.findPaymentSystem(
      deposit.payment_system_id,
    );

    await this.paymentManager
      .driver(paymentSystemEntity.merchant)
      .unsubscribe(deposit.payment_id);

    await this.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        unsubscribed: true,
      },
    });

    return 'You have successfully unsubscribed';
  }

  // Pay using payment link from payment system
  async payWithPaymentPage(
    userId: number,
    paymentSystemId: number,
    packageId: number,
  ): Promise<PaymentUrlResponseEntity> {
    const options: IPaymentRequestOptions = {
      userId: userId,
      paymentSystemId: paymentSystemId,
      packageId: packageId,
    };

    const paymentCallback = async (
      paymentDriver: PaymentDriver & WithPagePayment,
      options: IPaymentDataOptions,
    ): Promise<PaymentUrlResponseEntity> => {
      const deposit = await this.createDeposit(options.user, options.package);
      const trial = await this.checkIfSubscriptionHasTrial(
        options.user,
        options.package,
      );

      return paymentDriver.payWithPaymentPage({
        deposit: deposit,
        user: options.user,
        trial: trial,
      });
    };

    return this.pay(options, paymentCallback);
  }

  private async pay(
    data: IPaymentRequestOptions,
    callback: (
      driver: PaymentDriver & (WithPagePayment | WithCardPayment),
      options: IPaymentDataOptions,
    ) => Promise<any>,
  ): Promise<any> {
    const packageEntity = await this.findPackage(data.packageId);

    if (!packageEntity) {
      throw new BadRequestException('Undefined package');
    }

    const user = await this.findAuthUserWithLastPackage(data.userId);

    // Get payment system service
    const paymentInstance = await this.resolvePaymentSystem(
      data.paymentSystemId,
      packageEntity.price,
    );

    return callback(paymentInstance, {
      user: user,
      package: packageEntity,
      data: {
        paymentSystemId: data.paymentSystemId,
        packageId: data.packageId,
      },
    });
  }

  private async findPaymentSystem(id: number): Promise<PaymentSystemEntity> {
    return this.db.paymentSystem.findUnique({
      where: {
        id: id,
        is_active: true,
      },
    });
  }

  private async findAuthUserWithLastPackage(id: number): Promise<UserEntity> {
    const user: UserEntity = await this.db.user.findUnique({
      where: {
        id: id,
      },
    });

    const currentUserPackage: PackageEntity =
      await this.userRepoService.findCurrentPackage(user.id);

    return {
      ...user,
      currentPackage: currentUserPackage,
    };
  }

  private async findPackage(id: number): Promise<PackageEntity> {
    return this.db.package.findUnique({
      where: {
        is_active: true,
        id: id,
      },
      select: {
        id: true,
        type: true,
        price: true,
        name: true,
        is_active: true,
        is_trial: true,
        credits: true,
      },
    });
  }

  // Retrieve payment system driver, for example StripeDriver
  private async resolvePaymentSystem(
    id: number,
    amount: Decimal | number,
  ): Promise<PaymentDriver & (WithPagePayment | WithCardPayment)> {
    this.paymentSystemEntity = await this.findPaymentSystem(id);

    if (!this.paymentSystemEntity) {
      throw new BadRequestException('Payment system is invalid.');
    }

    if (amount instanceof Decimal) {
      amount = amount.toNumber();
    }

    if (this.paymentSystemEntity.min_deposit > amount) {
      throw new BadRequestException(
        `Minimum deposit for the payment system = ${this.paymentSystemEntity.min_deposit}`,
      );
    }

    return this.paymentManager.driver(this.paymentSystemEntity.merchant);
  }

  // Creating deposit with status 'Temp'
  private async createDeposit(
    user: UserEntity,
    packageEntity: PackageRepoInterface,
  ): Promise<DepositEntity> {
    let type = DepositType.NEW;

    if (user.currentPackage?.id === packageEntity.id) {
      type = DepositType.RENEWAL;
    }

    const deposit: DepositEntity = await this.db.deposit.create({
      data: {
        user_id: user.id,
        package_id: packageEntity.id,
        payment_system_id: this.paymentSystemEntity.id,
        amount: packageEntity.price,
        type: type,
        status: DepositStatus.TEMP,
      },
    });

    deposit['user'] = user;
    deposit['package'] = packageEntity;

    return deposit;
  }

  private async checkIfSubscriptionHasTrial(
    user: UserEntity,
    subscriptionPlan: PackageEntity,
  ): Promise<boolean> {
    if (!subscriptionPlan.is_trial) {
      return false;
    }

    // Check if the user has ever had a free plan
    const trialCount = await this.db.packageUser.count({
      where: {
        user_id: user.id,
        is_trial: true,
      },
    });

    return trialCount <= 0;
  }
}
