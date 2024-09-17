import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentManager } from './payment.manager';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentManager: PaymentManager) {}

  @Get('webhook/:paymentMethod')
  @Post('webhook/:paymentMethod')
  async handleWebhook(@Req() request: Request, @Param() params: any) {
    const paymentDriver = this.paymentManager.driver(params.paymentMethod);

    if (!('handleWebhook' in paymentDriver)) {
      throw new BadRequestException('Payment driver cannot handle webhook');
    }

    let data = null;

    if (request.method === 'GET') {
      data = request.query;
    } else {
      data = request.body;
    }

    return paymentDriver.handleWebhook(data);
  }
}
