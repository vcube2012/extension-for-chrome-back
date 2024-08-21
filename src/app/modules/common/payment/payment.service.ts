import { BadRequestException, Injectable } from '@nestjs/common';
import { MakeDepositInput } from './input/make-deposit.input';
import { PaymentSystemService } from '../../resources/payment-system/payment-system.service';
import { PackageService } from '../../resources/package/package.service';
import { DepositService } from '../../resources/deposit/deposit.service';
import { DatabaseService } from '../../globals/database/database.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UserEntity } from '../../resources/user/entity/user.entity';
import { UserRepoInterface } from '../../../repositories/user/user-repo.interface';
import { PackageRepoInterface } from '../../../repositories/package/package-repo.interface';

@Injectable()
export class PaymentService {
  constructor(
    private readonly db: DatabaseService,
    private readonly packageService: PackageService,
    private readonly paymentSystemService: PaymentSystemService,
    private readonly depositService: DepositService,
  ) {}

  async payWithUrl(userId: number, input: MakeDepositInput) {
    const packageEntity = await this.packageService.findActiveOne(
      input.package_id,
    );

    if (!packageEntity) {
      throw new BadRequestException('Undefined package');
    }

    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });

    const paymentSystem = await this.resolvePaymentSystem(
      input.payment_system_id,
      packageEntity.price,
    );

    // const deposit = await this.createDeposit(
    //   user,
    //   packageEntity,
    //   paymentSystem.id,
    //   packageEntity.price,
    // );

    // console.log(deposit);

    return {
      url: 'http://localhost:8080',
      txid: null,
    };
  }

  private async resolvePaymentSystem(id: number, amount) {
    const paymentSystem = await this.paymentSystemService.findActiveOne(id);

    if (!paymentSystem) {
      throw new BadRequestException('Payment system is invalid.');
    }

    if (Number(paymentSystem.min_deposit) > amount) {
      throw new BadRequestException(
        `Minimum deposit for the payment system = ${paymentSystem.min_deposit}`,
      );
    }

    return paymentSystem;
  }

  private async createDeposit(
    user: UserRepoInterface,
    packageEntity: PackageRepoInterface,
    payment_system_id: number,
    amount: number,
  ) {
    const createDepositDto = new CreateDepositDto();
    createDepositDto.user_id = user.id;
    createDepositDto.package_id = packageEntity.id;
    createDepositDto.payment_system_id = payment_system_id;
    createDepositDto.amount = amount;
    createDepositDto.type = 'waiting';

    return this.depositService.createDeposit(createDepositDto);
  }
}
