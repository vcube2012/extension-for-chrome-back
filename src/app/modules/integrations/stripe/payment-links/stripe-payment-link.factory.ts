import Stripe from 'stripe';
import { LineItem } from './interfaces/line-item.interface';
import { PaymentOptions } from '../../../common/payment/interfaces/payment-options.interface';

const TRIAL_PERIOD_DAYS = 30;

export class StripePaymentLinkFactory {
  constructor(
    private readonly client: Stripe,
    private readonly redirectUri: string,
  ) {}

  async create(lineItems: LineItem[], params: PaymentOptions) {
    return this.client.paymentLinks.create({
      line_items: lineItems,
      subscription_data: this.makeSubscriptionData(params),
      after_completion: {
        type: 'redirect',
        redirect: {
          url: this.redirectUri,
        },
      },
    });
  }

  private makeSubscriptionData(params: PaymentOptions): object {
    const data = {
      metadata: {
        deposit_id: params.deposit.id,
        package_id: params.deposit.package.id,
        user_id: params.user.id,
      },
    };

    if (params.trial) {
      data['trial_period_days'] = TRIAL_PERIOD_DAYS;
    }

    return data;
  }
}
