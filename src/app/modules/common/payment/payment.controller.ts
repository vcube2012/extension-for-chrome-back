import { All, Body, Controller, Param, Post, Req } from '@nestjs/common';
import { PaymentManager } from './payment.manager';
import { PaymentDriver } from './payment.driver';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import {
  SubscriptionChangedDto,
  SubscriptionChangedType,
} from './dto/subscription-changed.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentManager: PaymentManager) {}

  @Post('package-changed/:package')
  @ExceptionHandlerDecorator()
  async updateUserSubscriptionsAfterPackageUpdated(
    @Body() dto: SubscriptionChangedDto,
    @Param() params: any,
  ) {
    try {
      const drivers = this.paymentManager.getDrivers();

      for (const [driver, instance] of Object.entries(drivers)) {
        if (dto.type === SubscriptionChangedType.UPDATE) {
          await instance.handlePackageUpdate(Number(params.package));
        } else if (dto.type === SubscriptionChangedType.UNSUBSCRIBE) {
          await instance.unsubscribeAllUsersFromPackage(Number(params.package));
        } else if (dto.type === SubscriptionChangedType.ACTIVATED) {
          await instance.activateProduct(Number(params.package));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  @All('subscription-created/:paymentMethod')
  @ExceptionHandlerDecorator()
  async handleSubscriptionCreated(@Req() request, @Param() params: any) {
    const paymentDriver: PaymentDriver = this.paymentManager.driver(
      params.paymentMethod,
    );

    const data = request.method === 'GET' ? request.query : request.body;

    return paymentDriver.handleSubscriptionCreated(data);
  }

  @All('invoice-paid/:paymentMethod')
  @ExceptionHandlerDecorator()
  async handleInvoicePaid(@Req() request, @Param() params: any) {
    const paymentDriver: PaymentDriver = this.paymentManager.driver(
      params.paymentMethod,
    );

    const data = request.method === 'GET' ? request.query : request.body;

    return paymentDriver.handleInvoicePaidSuccessfully(data);
  }

  @All('invoice-failed/:paymentMethod')
  @ExceptionHandlerDecorator()
  async handleInvoiceFailed(@Req() request, @Param() params: any) {
    const paymentDriver: PaymentDriver = this.paymentManager.driver(
      params.paymentMethod,
    );

    const data = request.method === 'GET' ? request.query : request.body;

    return paymentDriver.handleInvoiceFailed(data);
  }
}
