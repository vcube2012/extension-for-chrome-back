import {
  All,
  BadRequestException,
  Controller,
  Param,
  Req,
} from '@nestjs/common';
import { PaymentManager } from './payment.manager';
import { PaymentDriver } from './payment.driver';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentManager: PaymentManager) {}

  @All('subscription-created/:paymentMethod')
  @ExceptionHandlerDecorator()
  async handleSubscriptionCreated(@Req() request, @Param() params: any) {
    const paymentDriver: PaymentDriver = this.paymentManager.driver(
      params.paymentMethod,
    );

    if (!('handleSubscription' in paymentDriver)) {
      throw new BadRequestException(
        'Payment driver cannot handle subscription',
      );
    }

    const data = request.method === 'GET' ? request.query : request.body;

    return paymentDriver.handleSubscription(data);
  }
}
