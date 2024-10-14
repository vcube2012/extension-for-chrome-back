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
import {
  DepositStatus,
  DepositType,
} from '../../../repositories/deposit/deposit-repo.interface';
import { PaymentSystemEntity } from '../../resources/payment-system/entity/payment-system.entity';

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

  // Create stripe product (subscription plan)
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

  // Generate and return payment link
  async payWithPaymentPage(
    options: PaymentOptions,
  ): Promise<PaymentUrlResponseEntity> {
    try {
      const paymentLinkFactory = new StripePaymentLinkFactory(
        this.client,
        this.redirectUri,
      );

      const lineItems = await this.makeLineItems(options.deposit.package);
      const paymentLink = await paymentLinkFactory.create(lineItems, options);

      await this.depositWaiting(options.deposit);

      return {
        url: paymentLink.url,
      };
    } catch (error) {
      console.error(error);

      await this.depositFailed(options.deposit, error.message);

      throw error;
    }
  }

  // Webhook method for handling created subscription by payment link
  async handleSubscriptionCreated(
    data: Stripe.CustomerSubscriptionCreatedEvent,
  ) {
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

    const deposit: DepositEntity = await this.db.deposit.findUniqueOrThrow({
      where: {
        id: Number(subscription.metadata.deposit_id),
      },
      include: {
        user: true,
        package: true,
      },
    });

    try {
      await this.unsubscribeUserFromPreviousSubscriptions(
        Number(subscription.metadata.user_id),
      );

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
    } catch (error) {
      console.error(error);
    }
  }

  // When user was paid an invoice
  async handleSuccessfullyPayment(data: Stripe.InvoicePaymentSucceededEvent) {
    const invoice: Stripe.Invoice = data.data.object;

    for (const lineItem of invoice.lines.data) {
      const userId = Number(lineItem.metadata.user_id);
      const packageId = Number(lineItem.metadata.package_id);

      if (!userId || !packageId) {
        continue;
      }

      let subscription = null;

      if (typeof lineItem.subscription === 'string') {
        subscription = await this.client.subscriptions.retrieve(
          lineItem.subscription,
        );
      } else {
        subscription = lineItem.subscription;
      }

      const isTrial = !!subscription.trial_end;

      if (invoice.billing_reason === 'subscription_create') {
        if (!lineItem.metadata.deposit_id) {
          continue;
        }

        const deposit: DepositEntity = await this.db.deposit.findUnique({
          where: {
            id: Number(lineItem.metadata.deposit_id),
          },
        });

        if (!deposit) continue;

        await this.depositSuccess(deposit, isTrial, invoice.id);
      } else if (invoice.billing_reason === 'subscription_cycle') {
        const paymentSystem: PaymentSystemEntity =
          await this.db.paymentSystem.findUnique({
            where: {
              merchant: 'stripe',
            },
          });

        const packageEntity: PackageEntity = await this.db.package.findUnique({
          where: {
            id: packageId,
          },
        });

        await this.db.deposit.create({
          data: {
            user_id: userId,
            package_id: packageId,
            payment_system_id: paymentSystem.id,
            amount: packageEntity.price,
            type: DepositType.RENEWAL,
            status: DepositStatus.SUCCESS,
            payment_id: invoice.id,
          },
        });

        await this.db.packageUser.updateMany({
          where: {
            user_id: userId,
            package_id: packageId,
            is_active: true,
          },
          data: {
            available_to: this.getDateForSubscriptionPlan(packageEntity.type),
          },
        });

        await this.earnCredits(userId, packageEntity);
      }
    }
  }

  async handleFailedPayment(data: Stripe.InvoicePaymentFailedEvent) {
    const depositId =
      data.data.object.subscription_details.metadata.deposit_id ?? null;

    if (!depositId) {
      return;
    }

    const deposit: DepositEntity = await this.db.deposit.findUniqueOrThrow({
      where: {
        id: Number(depositId),
      },
    });

    const chargeId =
      typeof data.data.object.charge === 'string'
        ? data.data.object.charge
        : data.data.object.charge.id;

    const charge = await this.client.charges.retrieve(chargeId);
    const error = `Error code: ${charge.failure_code}. Error message: ${charge.failure_message}`;

    await this.depositFailed(deposit, error, data.data.object.id);
  }

  // Cancel subscription
  async unsubscribe(subscriptionId: string) {
    const subscription = await this.client.subscriptions.cancel(subscriptionId);

    if (subscription.status !== 'canceled') {
      throw new BadRequestException(
        'Error processing unsubscribe. Try again later',
      );
    }
  }

  // Cancel subscription by deposit payment id
  async unsubscribeByPaymentId(paymentId: string) {
    try {
      const invoice = await this.client.invoices.retrieve(paymentId);

      const subscriptionId =
        typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription.id;

      await this.unsubscribe(subscriptionId);
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }
  }

  // When package was deleted in admin panel
  async unsubscribeAllUsersFromPackage(packageId: number) {
    const stripeId = await this.service.findOne({
      model_id: packageId,
      model_type: 'package',
      stripe_type: StripeType.PRODUCTS,
    });

    if (!stripeId) return;

    await this.client.products.update(stripeId, {
      active: false,
    });

    const packageSubscriptions = await this.client.subscriptions.search({
      query: `-status:'canceled' AND metadata['package_id']:'${packageId}'`,
    });

    for (const packageSubscription of packageSubscriptions.data) {
      packageSubscription.status;
      await this.client.subscriptions.cancel(packageSubscription.id);
    }
  }

  async unsubscribeUserFromPreviousSubscriptions(userId: number) {
    const activeResult = await this.client.subscriptions.search({
      query: `status:'active' AND metadata['user_id']:'${userId}'`,
    });

    const trialingResult = await this.client.subscriptions.search({
      query: `status:'trialing' AND metadata['user_id']:'${userId}'`,
    });

    const data = [...activeResult.data, ...trialingResult.data];

    if (data.length > 0) {
      for (const subscription of data) {
        await this.unsubscribe(subscription.id);
      }
    }
  }

  // When package price updated from admin panel
  async handlePackageUpdate(packageId: number) {
    const stripeId = await this.service.findOne({
      model_id: packageId,
      model_type: 'package',
      stripe_type: StripeType.PRODUCTS,
    });

    if (!stripeId) {
      return;
    }

    const subscriptionPlan: PackageEntity =
      await this.db.package.findUniqueOrThrow({
        where: {
          id: packageId,
        },
      });

    const productFactory = new StripeProductFactory(this.client);
    const stripeProduct = await productFactory.create(
      subscriptionPlan,
      stripeId,
    );

    const priceId =
      typeof stripeProduct.default_price === 'string'
        ? stripeProduct.default_price
        : stripeProduct.default_price.id;

    const subscriptions = await this.client.subscriptions.search({
      query: `-status:'canceled' AND metadata['package_id']:'${subscriptionPlan.id}'`,
    });

    for (const subscription of subscriptions.data) {
      for (const subItem of subscription.items.data) {
        await this.client.subscriptionItems.update(subItem.id, {
          price: priceId,
          proration_behavior: 'none',
        });
      }
    }
  }

  // When package activated in admin panel
  async activateProduct(packageId: number) {
    const stripeId = await this.service.findOne({
      model_id: packageId,
      model_type: 'package',
      stripe_type: StripeType.PRODUCTS,
    });

    if (!stripeId) return;

    await this.client.products.update(stripeId, {
      active: true,
    });
  }

  // Line items for payment link
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
