import Stripe from 'stripe';
import { StripeCustomerInterface } from './interfaces/stripe-customer.interface';

export class StripeCustomerFactory {
  constructor(private readonly client: Stripe) {}

  async create(
    options: StripeCustomerInterface,
    customerId?: string,
  ): Promise<Stripe.Customer> {
    let customer = null;

    if (!!customerId) {
      try {
        customer = await this.client.customers.retrieve(customerId);
      } catch (error) {
        if (error.statusCode !== 404) {
          throw error;
        }
      }
    }

    if (!customer) {
      return this.client.customers.create({
        ...options,
      });
    } else {
      if (options.name !== customer.name || options.email !== customer.email) {
        return this.client.customers.update(customer.id, {
          ...options,
        });
      }
    }

    return customer;
  }
}
