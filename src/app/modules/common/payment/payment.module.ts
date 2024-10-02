import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentManager } from './payment.manager';
import { UserRepoService } from '../../../repositories/user/user-repo.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../globals/database/database.service';
import { paymentProvider } from './providers/payment.provider';
import { ReferralCommissionService } from '../../../repositories/referral-bonus/referral-commission.service';
import { SiteSettingRepoService } from '../../../repositories/site-setting/site-setting-repo.service';

@Module({
  providers: [
    PaymentResolver,
    PaymentService,
    UserRepoService,
    ReferralCommissionService,
    SiteSettingRepoService,
    {
      provide: PaymentManager,
      inject: [ConfigService, DatabaseService, ReferralCommissionService],
      useFactory: (
        configService: ConfigService,
        db: DatabaseService,
        referralSystem: ReferralCommissionService,
      ) => {
        return paymentProvider(configService, db, referralSystem);
      },
    },
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
