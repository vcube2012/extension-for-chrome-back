import { Manager } from '../../../support/manager';
import { PaymentDriver } from './payment.driver';
import { WithPagePayment } from './interfaces/with-page-payment.interface';
import { WithCardPayment } from './interfaces/with-card-payment.interface';

export class PaymentManager extends Manager {
  driver(driver: string): PaymentDriver & (WithPagePayment | WithCardPayment) {
    if (!this.drivers.hasOwnProperty(driver)) {
      this.drivers[driver] = this.createDriver(driver);
    }

    return this.drivers[driver];
  }
}
