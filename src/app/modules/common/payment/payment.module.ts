import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentManager } from './payment.manager';
import { UserRepoService } from '../../../repositories/user/user-repo.service';
import { StripeRepoService } from '../../../repositories/stripe/stripe-repo.service';

@Module({
  providers: [
    PaymentResolver,
    PaymentService,
    UserRepoService,
    PaymentManager,
    StripeRepoService,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
