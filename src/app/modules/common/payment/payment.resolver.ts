import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { PaymentService } from './payment.service';
import { IContextServer } from '../graphql/graphql.module';
import { MakeDepositInput } from './input/make-deposit.input';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { PaymentUrlResponseEntity } from './entity/payment-url-response.entity';

@UseGuards(AuthGuard)
@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PaymentUrlResponseEntity)
  @ExceptionHandlerDecorator()
  async payWithUrl(
    @Args('input') input: MakeDepositInput,
    @Context() ctx: IContextServer,
  ) {
    return this.paymentService.payWithUrl(ctx.req.user.id, input);
  }
}
