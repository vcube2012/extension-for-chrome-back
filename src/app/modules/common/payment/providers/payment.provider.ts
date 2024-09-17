import { ConfigService } from '@nestjs/config';
import { PaymentManager } from '../payment.manager';
import { StripeDriver } from '../../../integrations/stripe/stripe.driver';
import { DatabaseService } from '../../../globals/database/database.service';
import { CentAppDriver } from '../../../integrations/cent-app/cent-app.driver';

export const paymentProvider = (
  configService: ConfigService,
  db: DatabaseService,
) => {
  const paymentManager = new PaymentManager();

  paymentManager.extend(
    'cent_app',
    () =>
      new CentAppDriver(
        configService.get<string>('cent_app.secret'),
        configService.get<string>('cent_app.shopId'),
        db,
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
