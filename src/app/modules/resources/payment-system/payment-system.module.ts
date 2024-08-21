import { Module } from '@nestjs/common';
import { PaymentSystemResolver } from './payment-system.resolver';
import { PaymentSystemService } from './payment-system.service';

@Module({
  providers: [PaymentSystemResolver, PaymentSystemService],
})
export class PaymentSystemModule {}
