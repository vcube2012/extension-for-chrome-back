import { ConfigService } from '@nestjs/config';
import { PaymentManager } from '../payment.manager';
import { StripeDriver } from '../../../integrations/stripe/stripe.driver';
import { DatabaseService } from '../../../globals/database/database.service';

export const paymentProvider = (
  configService: ConfigService,
  db: DatabaseService,
) => {
  const paymentManager = new PaymentManager();

  paymentManager.extend(
    'stripe',
    () =>
      new StripeDriver(
        configService.get<string>('stripe.secret'),
        configService.get<string>('stripe.redirect_uri'),
        db,
      ),
  );

  return paymentManager;
};
