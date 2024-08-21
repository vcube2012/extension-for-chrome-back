import { Query, Resolver } from '@nestjs/graphql';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { PaymentSystemService } from './payment-system.service';
import { PaymentSystemEntity } from './entity/payment-system.entity';

@Resolver()
export class PaymentSystemResolver {
  constructor(private readonly paymentSystemService: PaymentSystemService) {}

  @Query(() => [PaymentSystemEntity])
  @ExceptionHandlerDecorator()
  async getAllPaymentSystems() {
    return this.paymentSystemService.findAll();
  }
}
