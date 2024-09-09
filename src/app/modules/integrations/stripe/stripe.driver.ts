import Stripe from 'stripe';
import { WithPagePayment } from '../../common/payment/interfaces/with-page-payment.interface';
import { DepositEntity } from '../../resources/deposit/entity/deposit.entity';
import { PaymentOptions } from '../../common/payment/interfaces/payment-options.interface';
import { PaymentUrlResponseEntity } from '../../common/payment/entity/payment-url-response.entity';
import { StripeType } from './enums/stripe-type.enum';
import { StripeProductFactory } from './products/stripe-product.factory';
import { Currency } from '../../common/payment/enums/currency.enum';
import { DatabaseService } from '../../globals/database/database.service';
import { UserEntity } from '../../resources/user/entity/user.entity';
import { StripeCustomerFactory } from './customers/stripe-customer.factory';
import { PackageEntity } from '../../resources/package/entity/package.entity';

export class StripeDriver implements WithPagePayment {
  private readonly client: Stripe;

  constructor(
    readonly secret: string,
    private readonly redirectUri: string,
    private readonly db: DatabaseService,
  ) {
    this.client = new Stripe(secret);
  }

  async createCustomer(user: UserEntity) {
    const stripeId = await this.findStripeId(
      user.id,
      'user',
      StripeType.CUSTOMERS,
    );

    const customerFactory = new StripeCustomerFactory(this.client);

    const customer = await customerFactory.create(
      {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      },
      stripeId,
    );

    if (!!stripeId && customer.id !== stripeId) {
      await this.deleteStripeEntity(stripeId);
      await this.createStripeEntity(
        stripeId,
        user.id,
        'user',
        StripeType.CUSTOMERS,
      );
    } else if (!stripeId) {
      await this.createStripeEntity(
        customer.id,
        user.id,
        'user',
        StripeType.CUSTOMERS,
      );
    }

    return customer;
  }

  // Create stripe product (user plan)
  async createProduct(packageEntity: PackageEntity) {
    const stripeId = await this.findStripeId(
      packageEntity.id,
      'package',
      StripeType.PRODUCTS,
    );

    const productFactory = new StripeProductFactory(this.client);

    const product = await productFactory.create(
      {
        name: packageEntity.name,
        active: packageEntity.is_active,
        default_price_data: {
          currency: Currency.USD,
          unit_amount: packageEntity.price * 100,
        },
      },
      stripeId,
    );

    const price = await productFactory.findPriceFromProduct(product);

    if (!!stripeId && product.id !== stripeId) {
      await this.deleteStripeEntity(stripeId);
      await this.createStripeEntity(
        stripeId,
        packageEntity.id,
        'package',
        StripeType.PRODUCTS,
      );
    } else if (!stripeId) {
      await this.createStripeEntity(
        product.id,
        packageEntity.id,
        'package',
        StripeType.PRODUCTS,
      );
    }

    return {
      product: product,
      price: price,
    };
  }

  async payWithPaymentPage(
    options: PaymentOptions,
  ): Promise<PaymentUrlResponseEntity> {
    // const customer = await this.createCustomer(options.user);
    const product = await this.createProduct(options.deposit.package);

    const paymentLink = await this.client.paymentLinks.create({
      line_items: [
        {
          price: product.price.id,
          quantity: 1,
        },
      ],
      customer_creation: 'always',
      metadata: {
        deposit_id: options.deposit.id,
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: this.redirectUri,
        },
      },
    });

    console.log(paymentLink);

    return {
      url: paymentLink.url,
    };
  }

  private async findStripeId(
    modelId: number,
    modelType: string,
    stripeType: StripeType,
  ): Promise<string | null> {
    const entity = await this.db.stripe.findFirst({
      where: {
        model_type: modelType,
        model_id: modelId,
        stripe_type: stripeType,
      },
    });

    return entity?.stripe_id;
  }

  private async createStripeEntity(
    stripeId: string,
    modelId: number,
    modelType: string,
    stripeType: string,
  ) {
    return this.db.stripe.create({
      data: {
        stripe_id: stripeId,
        model_type: modelType,
        model_id: modelId,
        stripe_type: stripeType,
      },
    });
  }

  private async deleteStripeEntity(stripeId: string) {
    return this.db.stripe.delete({
      where: {
        stripe_id: stripeId,
      },
    });
  }
}
