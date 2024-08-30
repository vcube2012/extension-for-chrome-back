import { WithPagePayment } from '@/src/app/modules/common/payment/interfaces/with-page-payment.interface';
import Stripe from 'stripe';
import { PaymentOptions } from '@/src/app/modules/common/payment/interfaces/payment-options.interface';
import { PaymentUrlResponseEntity } from '@/src/app/modules/common/payment/entity/payment-url-response.entity';
import { DepositEntity } from '@/src/app/modules/resources/deposit/entity/deposit.entity';
import { StripeProductDto } from '@/src/app/integrations/stripe/dto/stripe-product.dto';
import { StripeRepoService } from '@/src/app/repositories/stripe/stripe-repo.service';

export class StripeDriver implements WithPagePayment {
  constructor(
    private readonly stripeRepoService: StripeRepoService,
    private readonly client: Stripe,
  ) {}

  async createProduct(deposit: DepositEntity) {
    const packageEntity = deposit.package;
    const stripeId = await this.stripeRepoService.getStripeId(
      packageEntity.id,
      'package',
    );

    console.log(stripeId);

    // const params = this.makeProduct(deposit);
    //
    // return this.client.products.create({ ...params });
  }

  private makeProduct(deposit: DepositEntity): StripeProductDto {
    const stripeProductDto = new StripeProductDto();
    stripeProductDto.name = deposit.package.name;
    stripeProductDto.metadata.deposit_id = deposit.id;

    return stripeProductDto;
  }

  async payWithPaymentPage(
    options: PaymentOptions,
  ): Promise<PaymentUrlResponseEntity> {
    const product = await this.createProduct(options.deposit);

    return {
      url: 'http://localhost:8080',
      payment_id: null,
    };
  }
}
