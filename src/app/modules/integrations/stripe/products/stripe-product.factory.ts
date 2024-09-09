import Stripe from 'stripe';
import { StripeProductInterface } from './stripe-product.interface';

export class StripeProductFactory {
  constructor(private readonly client: Stripe) {}

  async create(
    options: StripeProductInterface,
    productId?: string,
  ): Promise<Stripe.Product> {
    let product = null;

    if (!!productId) {
      product = await this.client.products.retrieve(productId);
    }

    const params = {
      name: options.name,
      active: options.active,
      default_price_data: {
        currency: options.default_price_data.currency,
        unit_amount: options.default_price_data.unit_amount,
      },
    };

    if (!product) {
      return this.client.products.create(params);
    } else {
      const priceData = await this.findPriceFromProduct(product);

      const productParams = {
        name: product.name,
        active: product.active,
      };

      if (options.default_price_data.unit_amount !== priceData.unit_amount) {
        const newPriceData = await this.client.prices.create({
          product: product.id,
          currency: options.default_price_data.currency,
          unit_amount: options.default_price_data.unit_amount,
        });

        productParams['default_price'] = newPriceData.id;
      }

      return this.client.products.update(product.id, productParams);
    }
  }

  async findPriceFromProduct(product: Stripe.Product) {
    if (!product.default_price) {
      throw new Error('Stripe product does not have default price');
    }

    const priceId =
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price.id;

    return this.client.prices.retrieve(priceId);
  }
}
