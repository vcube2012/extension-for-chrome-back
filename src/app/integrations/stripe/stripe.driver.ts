import Stripe from 'stripe';
import { StripeRepoService } from '../../repositories/stripe/stripe-repo.service';
import { WithPagePayment } from '../../modules/common/payment/interfaces/with-page-payment.interface';
import { DepositEntity } from '../../modules/resources/deposit/entity/deposit.entity';
import { StripeProductDto } from './dto/stripe-product.dto';
import { PaymentOptions } from '../../modules/common/payment/interfaces/payment-options.interface';
import { PaymentUrlResponseEntity } from '../../modules/common/payment/entity/payment-url-response.entity';

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
