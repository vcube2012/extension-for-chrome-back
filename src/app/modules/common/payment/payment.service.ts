import { BadRequestException, Injectable } from '@nestjs/common';
import { MakeDepositInput } from './input/make-deposit.input';
import { PaymentSystemService } from '../../resources/payment-system/payment-system.service';
import { PackageService } from '../../resources/package/package.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly packageService: PackageService,
    private readonly paymentSystemService: PaymentSystemService,
  ) {}

  async payWithUrl(userId: number, input: MakeDepositInput) {
    const packageEntity = await this.packageService.findActiveOne(
      input.package_id,
    );

    if (!packageEntity) {
      throw new BadRequestException('Undefined package');
    }

    const paymentSystem = await this.resolvePaymentSystem(
      input.payment_system_id,
      packageEntity.price,
    );

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
}
