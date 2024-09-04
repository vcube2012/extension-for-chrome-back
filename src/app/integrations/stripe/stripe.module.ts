import { Module } from '@nestjs/common';
import { StripeDriver } from './stripe.driver';
import { StripeRepoService } from '../../repositories/stripe/stripe-repo.service';

@Module({
  providers: [StripeDriver, StripeRepoService],
})
export class StripeModule {}
