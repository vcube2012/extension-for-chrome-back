import { ConfigService } from '@nestjs/config';
import { PaymentManager } from '../payment.manager';
import { DatabaseService } from '../../../globals/database/database.service';
import { ReferralCommissionService } from '../../../../repositories/referral-bonus/referral-commission.service';
import { StripeDriver } from '../../../integrations/stripe/stripe.driver';

export const paymentProvider = (
  configService: ConfigService,
  databaseService: DatabaseService,
  referralSystem: ReferralCommissionService,
) => {
  const paymentManager = new PaymentManager();

  paymentManager.extend(
    'stripe',
    () =>
      new StripeDriver(
        configService.get<string>('stripe.secret'),
        configService.get<string>('stripe.redirect_uri'),
        databaseService,
        referralSystem,
      ),
  );

  return paymentManager;
};
