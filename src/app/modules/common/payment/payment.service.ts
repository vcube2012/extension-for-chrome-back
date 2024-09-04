import { BadRequestException, Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PackageEntity } from '../../resources/package/entity/package.entity';
import { UserEntity } from '../../resources/user/entity/user.entity';
import { MakeDepositInput } from './inputs/make-deposit.input';
import { MakeDepositUsingCardInput } from './inputs/make-deposit-using-card.input';
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
        user: options.user,
      });
    };

    return this.pay(options, paymentCallback);
  }

  private async pay(
    data: IPaymentRequestOptions,
    callback: (
      d: WithPagePayment | WithCardPayment,
      opts: IPaymentDataOptions,
    ) => Promise<any>,
  ): Promise<any> {
    const packageEntity = await this.findPackage(data.input.package_id);

    if (!packageEntity) {
      throw new BadRequestException('Undefined package');
    }

    const user = await this.findAuthUserWithLastPackage(data.userId);

    // Отримання сервісу платіжної системи
    // const paymentInstance = await this.resolvePaymentSystem(
    //   data.input.payment_system_id,
    //   packageEntity.prices,
    // );

    // return callback(paymentInstance, {
    //   user: user,
    //   package: packageEntity,
    //   data: data.input,
    // });
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
        status: DepositStatus.WAITING,
      },
    });

    deposit['user'] = user;
    deposit['package'] = packageEntity;

    return deposit;
  }
}
