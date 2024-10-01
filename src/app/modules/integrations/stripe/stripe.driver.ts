import Stripe from 'stripe';
import { WithPagePayment } from '../../common/payment/interfaces/with-page-payment.interface';
import { PaymentOptions } from '../../common/payment/interfaces/payment-options.interface';
import { PaymentUrlResponseEntity } from '../../common/payment/entity/payment-url-response.entity';
import { StripeType } from './enums/stripe-type.enum';
import { StripeProductFactory } from './products/stripe-product.factory';
import { DatabaseService } from '../../globals/database/database.service';
import { PackageEntity } from '../../resources/package/entity/package.entity';
import { ReferralCommissionService } from '../../../repositories/referral-bonus/referral-commission.service';
import { PaymentDriver } from '../../common/payment/payment.driver';
import { StripeService } from './stripe.service';
import { BadRequestException } from '@nestjs/common';
import { DepositEntity } from '../../resources/deposit/entity/deposit.entity';
import { StripePaymentLinkFactory } from './payment-links/stripe-payment-link.factory';
import { LineItem } from './payment-links/interfaces/line-item.interface';

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
    const paymentLinkFactory = new StripePaymentLinkFactory(
      this.client,
      this.redirectUri,
    );

    const lineItems = await this.makeLineItems(options.deposit.package);
    const paymentLink = await paymentLinkFactory.create(
      lineItems,
      options.deposit.id,
      options.user.id,
    );

    await this.depositWaiting(options.deposit);

    return {
      url: paymentLink.url,
    };
  }

  async handleSubscription(data: Stripe.CustomerSubscriptionCreatedEvent) {
    const subscription: Stripe.Subscription = data.data.object;

    if (!subscription.metadata.deposit_id) {
      throw new BadRequestException(
        'Subscription cannot exists without deposit id',
      );
    }

    if (!subscription.metadata.user_id) {
      throw new BadRequestException(
        'Subscription cannot exists without user id',
      );
    }

    await this.unsubscribeFromPreviousSubscriptions(
      Number(subscription.metadata.user_id),
    );

    const deposit: DepositEntity = await this.db.deposit.findUniqueOrThrow({
      where: {
        id: Number(subscription.metadata.deposit_id),
      },
      include: {
        user: true,
      },
    });

    if (!deposit.user) {
      throw new BadRequestException('Undefined deposit user');
    }

    const customerId: string =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id;

    await this.service.findOrCreate(
      {
        model_id: deposit.user_id,
        model_type: 'user',
        stripe_type: StripeType.CUSTOMERS,
      },
      customerId,
    );

    await this.depositSuccess(deposit);

    await this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        payment_id: subscription.id,
      },
    });
  }

  async unsubscribe(subscriptionId: any) {
    try {
      const subscription =
        await this.client.subscriptions.cancel(subscriptionId);

      if (subscription.status !== 'canceled') {
        throw new BadRequestException(
          'Error processing unsubscribe. Try again later',
        );
      }
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }
  }

  async unsubscribeFromPreviousSubscriptions(userId: number) {
    const searchResult = await this.client.subscriptions.search({
      query: `status:'active' AND metadata['user_id']:'${userId}'`,
    });

    if (searchResult?.data?.length > 0) {
      for (const subscription of searchResult.data) {
        await this.unsubscribe(subscription.id);
      }
    }
  }

  private async makeLineItems(
    subscriptionPlan: PackageEntity,
  ): Promise<LineItem[]> {
    const product = await this.createProduct(subscriptionPlan);

    return [
      {
        price: product.price.id,
        quantity: 1,
      },
    ];
  }
}
