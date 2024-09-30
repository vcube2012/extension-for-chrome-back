import Stripe from 'stripe';
import { PackageEntity } from '../../../resources/package/entity/package.entity';
import { Currency } from '../../../common/payment/enums/currency.enum';
import { SubscriptionInterval } from './enums/subscription-interval.enum';
import { PackageType } from '../../../../repositories/package/package-repo.interface';

export class StripeProductFactory {
  constructor(private readonly client: Stripe) {}

  async create(
    subscription: PackageEntity,
    productId?: string,
  ): Promise<Stripe.Product> {
    let product = null;

    if (!!productId) {
      product = await this.client.products.retrieve(productId);
    }

    const amount = subscription.price * 100;
    const currency = Currency.USD;
    const recurringInterval =
      subscription.type == PackageType.MONTHLY
        ? SubscriptionInterval.MONTH
        : SubscriptionInterval.YEAR;

    const params = {
      name: subscription.name,
      active: subscription.is_active,
      default_price_data: {
        currency: currency,
        unit_amount: amount,
        recurring: {
          interval: recurringInterval,
        },
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

      if (amount !== priceData?.unit_amount) {
        const newPriceData = await this.client.prices.create({
          product: product.id,
          currency: currency,
          unit_amount: amount,
          recurring: {
            interval: recurringInterval,
          },
        });

        productParams['default_price'] = newPriceData.id;
      }

      return this.client.products.update(product.id, productParams);
    }
  }

  async findPriceFromProduct(product: Stripe.Product) {
    if (!product.default_price) {
      return null;
    }

    const priceId =
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price.id;

    return this.client.prices.retrieve(priceId);
  }
}
