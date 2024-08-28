import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UserRepoService } from '@/src/app/repositories/user/user-repo.service';

@Module({
  providers: [PaymentResolver, PaymentService, UserRepoService],
  controllers: [PaymentController],
})
export class PaymentModule {}
