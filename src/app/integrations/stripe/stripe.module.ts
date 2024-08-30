import { Module } from '@nestjs/common';
import { StripeDriver } from '@/src/app/integrations/stripe/stripe.driver';
import { StripeRepoService } from '@/src/app/repositories/stripe/stripe-repo.service';

@Module({
  providers: [StripeDriver, StripeRepoService],
})
export class StripeModule {}
