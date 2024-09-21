import { ConfigService } from '@nestjs/config';
import { PaymentManager } from '../payment.manager';
import { DatabaseService } from '../../../globals/database/database.service';
import { CentAppDriver } from '../../../integrations/cent-app/cent-app.driver';
import { ReferralCommissionService } from '../../../../repositories/referral-bonus/referral-commission.service';

export const paymentProvider = (
  configService: ConfigService,
  databaseService: DatabaseService,
  referralSystem: ReferralCommissionService,
) => {
  const paymentManager = new PaymentManager();

  paymentManager.extend(
    'cent_app',
    () =>
      new CentAppDriver(
        configService.get<string>('cent_app.secret'),
        configService.get<string>('cent_app.shopId'),
        databaseService,
        referralSystem,
      ),
  );

  // paymentManager.extend(
  //   'stripe',
  //   () =>
  //     new StripeDriver(
  //       configService.get<string>('stripe.secret'),
  //       configService.get<string>('stripe.redirect_uri'),
  //       db,
  //     ),
  // );

  return paymentManager;
};
