import { WithPagePayment } from '../../common/payment/interfaces/with-page-payment.interface';
import { PaymentOptions } from '../../common/payment/interfaces/payment-options.interface';
import { PaymentUrlResponseEntity } from '../../common/payment/entity/payment-url-response.entity';
import axios from 'axios';
import { CentAppOptions } from './cent-app-options.interface';
import { DatabaseService } from '../../globals/database/database.service';

export class CentAppDriver implements WithPagePayment {
  private readonly baseUrl = 'https://cent.app';
  private readonly currency = 'USD';
  private readonly payersPayCommission = true;
  private readonly description = 'Account replenishment';

  constructor(
    private readonly secret: string,
    private readonly shopId: string,
    private readonly db: DatabaseService,
  ) {}

  async payWithPaymentPage(
    options: PaymentOptions,
  ): Promise<PaymentUrlResponseEntity> {
    const params: CentAppOptions = {
      amount: options.deposit.package.price,
      order_id: options.deposit.id,
      currency_in: this.currency,
      payer_pays_commission: Number(this.payersPayCommission),
      description: this.description,
      shop_id: this.shopId,
    };

    try {
      const response = await this.sendRequest('/api/v1/bill/create', params);

      if (response.data?.success) {
        await this.setPaymentIdForDeposit(
          options.deposit.id,
          response.data.bill_id,
        );

        return {
          url: response.data.link_page_url,
        };
      } else {
        throw new Error('Payment status not success');
      }
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message ?? error.message;

      if (errors) {
        await this.setErrorForDeposit(options.deposit.id, errors);
      } else if (message) {
        await this.setErrorForDeposit(options.deposit.id, message);
      }

      throw new Error(message || 'Payment error');
    }
  }

  private async setPaymentIdForDeposit(depositId: number, paymentId: string) {
    return this.db.deposit.update({
      where: {
        id: depositId,
      },
      data: {
        payment_id: paymentId,
      },
    });
  }

  private async setErrorForDeposit(depositId: number, errors: string | object) {
    let message = null;

    if (typeof errors == 'string') {
      message = errors;
    } else {
      message = '';
      for (const [key, values] of Object.entries(errors)) {
        message += `${key}: `;

        for (const str of values) {
          message += `${str}; `;
        }
      }
    }

    return this.db.deposit.update({
      where: {
        id: depositId,
      },
      data: {
        error: message,
      },
    });
  }

  private async sendRequest(url: string, options: CentAppOptions) {
    const httpClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'json',
      },
    });

    return httpClient.post(url, options);
  }
}
