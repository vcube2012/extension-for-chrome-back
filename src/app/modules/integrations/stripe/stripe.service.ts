import { DatabaseService } from '../../globals/database/database.service';
import { CreateStripeOptions } from './interfaces/create-stripe-options.interface';
import { FindStripeOptions } from './interfaces/find-stripe-options.interface';
import { Prisma } from '@prisma/client';

export class StripeService {
  constructor(private readonly db: DatabaseService) {}

  async create(options: CreateStripeOptions) {
    return this.db.stripe.create({
      data: { ...options },
    });
  }

  async findOrCreate(findOptions: FindStripeOptions, stripeId: string) {
    let entity = await this.findOne(findOptions, false);

    if (!entity) {
      entity = await this.create({
        stripe_id: stripeId,
        model_type: findOptions.model_type,
        model_id: findOptions.model_id,
        stripe_type: findOptions.stripe_type,
      });
    }

    return entity;
  }

  async findOne(
    options: FindStripeOptions,
    onlyId: boolean = true,
  ): Promise<string | Prisma.Prisma__StripeClient<any> | null> {
    const entity = await this.db.stripe.findFirst({
      where: { ...options },
    });

    return onlyId ? entity?.stripe_id : entity;
  }

  async delete(id: string) {
    return this.db.stripe.delete({
      where: {
        stripe_id: id,
      },
    });
  }
}
