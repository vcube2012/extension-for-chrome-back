import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { PaymentService } from './payment.service';
import { IContextServer } from '../graphql/graphql.module';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { PaymentUrlResponseEntity } from './entity/payment-url-response.entity';
import { MakeDepositInput } from './inputs/make-deposit.input';
import { MakeDepositUsingCardInput } from './inputs/make-deposit-using-card.input';

@UseGuards(AuthGuard)
@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PaymentUrlResponseEntity)
  @ExceptionHandlerDecorator()
  async payWithPaymentPage(
    @Args('input') input: MakeDepositInput,
    @Context() ctx: IContextServer,
  ): Promise<PaymentUrlResponseEntity> {
    return this.paymentService.payWithPaymentPage(ctx.req.user.id, input);
  }

  @Mutation(() => String)
  @ExceptionHandlerDecorator()
  async payWithBankCard(
    @Args('input') input: MakeDepositUsingCardInput,
    @Context() ctx: IContextServer,
  ) {
    return this.paymentService.payWithCard(ctx.req.user.id, input);
  }
}
