import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UserRepoService } from '@/src/app/repositories/user/user-repo.service';
import { PaymentManager } from '@/src/app/modules/common/payment/payment.manager';
import { StripeRepoService } from '@/src/app/repositories/stripe/stripe-repo.service';

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
