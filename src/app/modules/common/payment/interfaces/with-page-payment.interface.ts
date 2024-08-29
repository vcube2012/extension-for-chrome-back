import { PaymentOptions } from '@/src/app/modules/common/payment/interfaces/payment-options.interface';
import { PaymentUrlResponseEntity } from '@/src/app/modules/common/payment/entity/payment-url-response.entity';

export interface WithPagePayment {
  payWithPaymentPage(
    options: PaymentOptions,
  ): Promise<PaymentUrlResponseEntity>;
}
