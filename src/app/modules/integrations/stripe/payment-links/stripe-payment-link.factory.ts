import Stripe from 'stripe';
import { LineItem } from './interfaces/line-item.interface';

export class StripePaymentLinkFactory {
  constructor(
    private readonly client: Stripe,
    private readonly redirectUri: string,
  ) {}

  async create(lineItems: LineItem[], depositId: number) {
    return this.client.paymentLinks.create({
      line_items: lineItems,
      subscription_data: {
        metadata: {
          deposit_id: depositId,
        },
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: this.redirectUri,
        },
      },
    });
  }
}
