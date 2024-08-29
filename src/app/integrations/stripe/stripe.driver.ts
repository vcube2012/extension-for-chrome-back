import { WithPagePayment } from '@/src/app/modules/common/payment/interfaces/with-page-payment.interface';
import Stripe from 'stripe';
import { PaymentOptions } from '@/src/app/modules/common/payment/interfaces/payment-options.interface';
import { PaymentUrlResponseEntity } from '@/src/app/modules/common/payment/entity/payment-url-response.entity';

export class StripeDriver implements WithPagePayment {
  private client?: Stripe = null;

  constructor(apiKey: string) {
    this.client = new Stripe(apiKey);
  }

  async createCustomer() {}

  async payWithPaymentPage(
    options: PaymentOptions,
  ): Promise<PaymentUrlResponseEntity> {
    return {
      url: 'http://localhost:8080',
      txid: null,
    };
  }
}
