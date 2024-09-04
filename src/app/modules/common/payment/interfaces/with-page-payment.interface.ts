import { PaymentOptions } from './payment-options.interface';
import { PaymentUrlResponseEntity } from '../entity/payment-url-response.entity';

export interface WithPagePayment {
  payWithPaymentPage(
    options: PaymentOptions,
  ): Promise<PaymentUrlResponseEntity>;
}
