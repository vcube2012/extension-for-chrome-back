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

@Injectable()
export class PaymentService {
  private paymentSystemEntity?: PaymentSystemEntity = null;
  constructor(
    private readonly db: DatabaseService,
    private readonly userRepoService: UserRepoService,
    private readonly paymentManager: PaymentManager,
  ) {}

  async payWithCard(userId: number) {
    return 'Test. User id - ' + userId;
  }

  async payWithPaymentPage(userId: number, input: MakeDepositInput) {
    const packageEntity = await this.findPackage(input.package_id);

    if (!packageEntity) {
      throw new BadRequestException('Undefined package');
    }

    // Cast from Decimal to number
    const amount = packageEntity.price.toNumber();

    const user = await this.findAuthUserWithLastPackage(userId);

    // Отримання сервісу платіжної системи
    const paymentSystemInstance = await this.resolvePaymentSystem(
      input.payment_system_id,
      amount,
    );

    // if (this.)

    // Створення депозиту з статусом 'Очікується'
    const deposit = await this.createDeposit(user, packageEntity, amount);

    console.log(deposit);

    return {
      url: 'http://localhost:8080',
      txid: null,
    };
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

    const currentUserPackage = await this.userRepoService.findCurrentPackage(
      user.id,
    );

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

  // Отримати драйвер платіжною системи, наприклад Stripe
  private async resolvePaymentSystem(id: number, amount: number) {
    this.paymentSystemEntity = await this.findPaymentSystem(id);

    if (!this.paymentSystemEntity) {
      throw new BadRequestException('Payment system is invalid.');
    }

    if (this.paymentSystemEntity.min_deposit.toNumber() > amount) {
      throw new BadRequestException(
        `Minimum deposit for the payment system = ${this.paymentSystemEntity.min_deposit}`,
      );
    }

    return this.paymentManager.driver(this.paymentSystemEntity.merchant);
  }

  private async createDeposit(
    user: UserEntity,
    packageEntity: PackageRepoInterface,
    amount: number,
  ) {
    return this.db.deposit.create({
      data: {
        user_id: user.id,
        package_id: packageEntity.id,
        payment_system_id: this.paymentSystemEntity.id,
        amount: amount,
        type: DepositType.NEW,
        status: DepositStatus.WAITING,
      },
    });
  }
}
