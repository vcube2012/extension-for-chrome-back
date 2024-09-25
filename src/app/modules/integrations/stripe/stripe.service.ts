import { DatabaseService } from '../../globals/database/database.service';
import { CreateStripeOptions } from './interfaces/create-stripe-options.interface';
import { FindStripeOptions } from './interfaces/find-stripe-options.interface';

export class StripeService {
  constructor(private readonly db: DatabaseService) {}

  async create(options: CreateStripeOptions) {
    return this.db.stripe.create({
      data: { ...options },
    });
  }

  async findOne(options: FindStripeOptions): Promise<string | null> {
    const entity = await this.db.stripe.findFirst({
      where: { ...options },
    });

    return entity?.stripe_id;
  }

  async delete(id: string) {
    return this.db.stripe.delete({
      where: {
        stripe_id: id,
      },
    });
  }
}
