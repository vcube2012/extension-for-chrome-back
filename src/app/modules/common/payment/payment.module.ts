import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentManager } from './payment.manager';
import { UserRepoService } from '../../../repositories/user/user-repo.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../globals/database/database.service';
import { paymentProvider } from './providers/payment.provider';

@Module({
  providers: [
    PaymentResolver,
    PaymentService,
    UserRepoService,
    {
      provide: PaymentManager,
      inject: [ConfigService, DatabaseService],
      useFactory: (configService: ConfigService, db: DatabaseService) => {
        return paymentProvider(configService, db);
      },
    },
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
