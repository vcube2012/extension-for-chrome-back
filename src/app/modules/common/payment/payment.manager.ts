import { BadRequestException, Injectable } from '@nestjs/common';
import { Stripe } from '@/src/app/integrations/stripe/stripe';

@Injectable()
export class PaymentManager {
  private drivers: string[] = [];

  // Отримати instance системи оплати
  driver(driver: string) {
    if (!this.drivers[driver]) {
      this.drivers.push(this.createDriver(driver));
    }

    return this.drivers[driver];
  }

  createDriver(driver: string) {
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

  private createStripeDriver() {
    return new Stripe();
  }
}
