import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentSystemService } from '../../resources/payment-system/payment-system.service';
import { PackageService } from '../../resources/package/package.service';

@Module({
  providers: [
    PaymentResolver,
    PaymentService,
    PaymentSystemService,
    PackageService,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
