import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeDriver } from '@/src/app/integrations/stripe/stripe.driver';
import { WithCardPayment } from '@/src/app/modules/common/payment/interfaces/with-card-payment.interface';
import { WithPagePayment } from '@/src/app/modules/common/payment/interfaces/with-page-payment.interface';

@Injectable()
export class PaymentManager {
  private drivers: (WithPagePayment | WithCardPayment)[] = [];

  // Отримати instance системи оплати
  driver(driver: string): WithPagePayment | WithCardPayment {
    if (!this.drivers[driver]) {
      this.drivers.push(this.createDriver(driver));
    }

    return this.drivers[driver];
  }

  createDriver(driver: string): WithPagePayment | WithCardPayment {
    const method = this.generateMethodFromDriver(driver);

    if (method in this) {
      return this[method]();
    }

    throw new BadRequestException(`Undefined driver - ${driver}`);
  }

  private generateMethodFromDriver(driver: string) {
    return (
      'create' + driver.charAt(0).toUpperCase() + driver.slice(1) + 'Driver'
    );
  }

  private createStripeDriver(): StripeDriver {
    return new StripeDriver(process.env.STRIPE_SECRET);
  }
}
