import { BadRequestException, Injectable } from '@nestjs/common';
import { PackageEntity } from '@/src/app/modules/resources/package/entity/package.entity';
import { UserEntity } from '@/src/app/modules/resources/user/entity/user.entity';
import { PaymentSystemEntity } from '@/src/app/modules/resources/payment-system/entity/payment-system.entity';
import { UserRepoService } from '@/src/app/repositories/user/user-repo.service';
import { DatabaseService } from '@/src/app/modules/globals/database/database.service';
import { MakeDepositInput } from '@/src/app/modules/common/payment/inputs/make-deposit.input';
import { PackageRepoInterface } from '@/src/app/repositories/package/package-repo.interface';
import {
  DepositStatus,
  DepositType,
} from '@/src/app/repositories/deposit/deposit-repo.interface';
import { PaymentManager } from '@/src/app/modules/common/payment/payment.manager';
import { MakeDepositUsingCardInput } from '@/src/app/modules/common/payment/inputs/make-deposit-using-card.input';
import { DepositEntity } from '@/src/app/modules/resources/deposit/entity/deposit.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { WithPagePayment } from '@/src/app/modules/common/payment/interfaces/with-page-payment.interface';
import { WithCardPayment } from '@/src/app/modules/common/payment/interfaces/with-card-payment.interface';
import { PaymentUrlResponseEntity } from '@/src/app/modules/common/payment/entity/payment-url-response.entity';
import { StripeDriver } from '@/src/app/integrations/stripe/stripe.driver';

interface IPaymentDataOptions {
  package: PackageEntity;
  user: UserEntity;
  data: MakeDepositInput | MakeDepositUsingCardInput;
}

interface IPaymentRequestOptions {
  userId: number;
  input: MakeDepositInput | MakeDepositUsingCardInput;
}

@Injectable()
export class PaymentService {
  private paymentSystemEntity?: PaymentSystemEntity = null;

  constructor(
    private readonly db: DatabaseService,
    private readonly userRepoService: UserRepoService,
    private readonly paymentManager: PaymentManager,
  ) {}

  async payWithCard(userId: number, input: MakeDepositUsingCardInput) {
    return 'Payment with card. User id - ' + userId;
  }

  async payWithPaymentPage(
    userId: number,
    input: MakeDepositInput,
  ): Promise<PaymentUrlResponseEntity> {
    const options: IPaymentRequestOptions = {
      userId: userId,
      input: input,
    };

    const paymentCallback = async (
      paymentDriver: WithPagePayment,
      options: IPaymentDataOptions,
    ): Promise<PaymentUrlResponseEntity> => {
      const deposit = await this.createDeposit(options.user, options.package);

      return paymentDriver.payWithPaymentPage({
        deposit: deposit,
      });
    };

    return this.pay(options, paymentCallback);
  }

  private async pay(
    data: IPaymentRequestOptions,
    callback: (
      d: WithPagePayment | WithCardPayment,
      opts: IPaymentDataOptions,
    ) => any,
  ) {
    const packageEntity = await this.findPackage(data.input.package_id);

    if (!packageEntity) {
      throw new BadRequestException('Undefined package');
    }

    const user = await this.findAuthUserWithLastPackage(data.userId);

    // Отримання сервісу платіжної системи
    const paymentInstance = await this.resolvePaymentSystem(
      data.input.payment_system_id,
      packageEntity.price,
    );

    return callback(paymentInstance, {
      user: user,
      package: packageEntity,
      data: data.input,
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
    const user = await this.db.user.findUnique({
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
        credits: true,
      },
    });
  }

  // Отримати драйвер платіжною системи, наприклад StripeDriver
  private async resolvePaymentSystem(
    id: number,
    amount: Decimal | number,
  ): Promise<WithPagePayment | WithCardPayment> {
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

  // Створення депозиту з статусом 'Очікується'
  private async createDeposit(
    user: UserEntity,
    packageEntity: PackageRepoInterface,
  ): Promise<DepositEntity> {
    return this.db.deposit.create({
      data: {
        user_id: user.id,
        package_id: packageEntity.id,
        payment_system_id: this.paymentSystemEntity.id,
        amount: packageEntity.price,
        type: DepositType.NEW,
        status: DepositStatus.WAITING,
      },
    });
  }
}
