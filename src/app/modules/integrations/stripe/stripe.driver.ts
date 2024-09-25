import Stripe from 'stripe';
import { WithPagePayment } from '../../common/payment/interfaces/with-page-payment.interface';
import { PaymentOptions } from '../../common/payment/interfaces/payment-options.interface';
import { PaymentUrlResponseEntity } from '../../common/payment/entity/payment-url-response.entity';
import { StripeType } from './enums/stripe-type.enum';
import { StripeProductFactory } from './products/stripe-product.factory';
import { DatabaseService } from '../../globals/database/database.service';
import { UserEntity } from '../../resources/user/entity/user.entity';
import { StripeCustomerFactory } from './customers/stripe-customer.factory';
import { PackageEntity } from '../../resources/package/entity/package.entity';
import { ReferralCommissionService } from '../../../repositories/referral-bonus/referral-commission.service';
import { PaymentDriver } from '../../common/payment/payment.driver';
import { StripeService } from './stripe.service';

export class StripeDriver extends PaymentDriver implements WithPagePayment {
  private readonly client: Stripe;
  private readonly service: StripeService;

  constructor(
    readonly secret: string,
    private readonly redirectUri: string,
    protected readonly db: DatabaseService,
    protected readonly referralSystem: ReferralCommissionService,
  ) {
    super(db, referralSystem);

    this.client = new Stripe(secret);
    this.service = new StripeService(db);
  }

  async createCustomer(user: UserEntity) {
    const stripeId = await this.service.findOne({
      model_id: user.id,
      model_type: 'user',
      stripe_type: StripeType.CUSTOMERS,
    });

    const customerFactory = new StripeCustomerFactory(this.client);

    const customer = await customerFactory.create(
      {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      },
      stripeId,
    );

    if (!!stripeId && customer.id !== stripeId) {
      await this.service.delete(stripeId);
      await this.service.create({
        stripe_id: stripeId,
        stripe_type: StripeType.CUSTOMERS,
        model_id: user.id,
        model_type: 'user',
      });
    } else if (!stripeId) {
      await this.service.create({
        stripe_id: customer.id,
        stripe_type: StripeType.CUSTOMERS,
        model_id: user.id,
        model_type: 'user',
      });
    }

    return customer;
  }

  // Create stripe product (user plan)
  async createProduct(packageEntity: PackageEntity) {
    const stripeId = await this.service.findOne({
      model_id: packageEntity.id,
      model_type: 'package',
      stripe_type: StripeType.PRODUCTS,
    });

    const productFactory = new StripeProductFactory(this.client);

    const product = await productFactory.create(packageEntity, stripeId);

    const price = await productFactory.findPriceFromProduct(product);

    if (!!stripeId && product.id !== stripeId) {
      await this.service.delete(stripeId);
      await this.service.create({
        stripe_id: stripeId,
        stripe_type: StripeType.PRODUCTS,
        model_id: packageEntity.id,
        model_type: 'package',
      });
    } else if (!stripeId) {
      await this.service.create({
        stripe_id: product.id,
        stripe_type: StripeType.PRODUCTS,
        model_id: packageEntity.id,
        model_type: 'package',
      });
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

    return {
      url: paymentLink.url,
    };
  }
}
