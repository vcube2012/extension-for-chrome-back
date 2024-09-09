import { Currency } from '../../../common/payment/enums/currency.enum';

interface StripeDefaultPriceData {
  currency: Currency;
  unit_amount: number;
}

export interface StripeProductInterface {
  name: string;
  active: boolean;
  default_price_data?: StripeDefaultPriceData;
}
