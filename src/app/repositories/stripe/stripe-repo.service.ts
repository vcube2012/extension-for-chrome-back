import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/src/app/modules/globals/database/database.service';

@Injectable()
export class StripeRepoService {
  constructor(private readonly db: DatabaseService) {}

  async getStripeId(
    modelId: number,
    modelType: string,
  ): Promise<string | null> {
    const stripeEntity = await this.db.stripe.findFirst({
      where: {
        model_type: modelType,
        model_id: modelId,
      },
    });

    return stripeEntity?.stripe_id;
  }
}
