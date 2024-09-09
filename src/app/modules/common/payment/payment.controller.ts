import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('payments')
export class PaymentController {
  @Get('webhook/:paymentMethod')
  async handleWebhook(@Req() request: Request, @Param() params: any) {
    console.log(request, params);
  }
}
