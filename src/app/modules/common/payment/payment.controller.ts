import {
  All,
  BadRequestException,
  Controller,
  Param,
  Req,
} from '@nestjs/common';
import { PaymentManager } from './payment.manager';
import { PaymentDriver } from './payment.driver';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentManager: PaymentManager) {}

  @All('subscription-created/:paymentMethod')
  async handleSubscriptionCreated(@Req() request, @Param() params: any) {
    const paymentDriver: PaymentDriver = this.paymentManager.driver(
      params.paymentMethod,
    );

    if (!('handleSubscription' in paymentDriver)) {
      throw new BadRequestException(
        'Payment driver cannot handle subscription',
      );
    }

    let data = null;

    if (request.method === 'GET') {
      data = request.query;
    } else {
      data = request.body;
    }

    return paymentDriver.handleSubscription(data);
  }
}
