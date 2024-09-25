import { Currency } from '../../../../common/payment/enums/currency.enum';
import { SubscriptionInterval } from '../enums/subscription-interval.enum';

interface StripeDefaultPriceData {
  currency: Currency;
  unit_amount: number;
}

export interface StripeProductInterface {
  name: string;
  active: boolean;
  default_price_data?: StripeDefaultPriceData;
  recurring_interval: SubscriptionInterval;
}
