import Stripe from 'stripe';
import { StripeProductInterface } from '../products/stripe-product.interface';

export class StripePriceFactory {
  constructor(private readonly client: Stripe) {}

  async create(
    options: StripeProductInterface,
    productId?: string,
  ): Promise<Stripe.Product> {
    let product = null;

    if (!!productId) {
      product = await this.client.products.retrieve(productId);
    }

    if (!product) {
      return this.client.products.create({
        name: options.name,
        active: options.active,
        default_price_data: {
          currency: options.default_price_data.currency,
          unit_amount: options.default_price_data.unit_amount,
        },
      });
    }

    return product;
  }
}
