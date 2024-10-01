import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { PaymentService } from './payment.service';
import { IContextServer } from '../graphql/graphql.module';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { PaymentUrlResponseEntity } from './entity/payment-url-response.entity';
import { MakeDepositInput } from './inputs/make-deposit.input';
import { RenewPackageInput } from './inputs/renew-package.input';

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
    return this.paymentService.payWithPaymentPage(
      ctx.req.user.id,
      input.payment_system_id,
      input.package_id,
    );
  }

  @Mutation(() => PaymentUrlResponseEntity)
  @ExceptionHandlerDecorator()
  async renewPackage(
    @Context() ctx: IContextServer,
    @Args('input') input: RenewPackageInput,
  ) {
    return this.paymentService.renewPackage(
      ctx.req.user.id,
      input.payment_system_id,
    );
  }

  @Mutation(() => String)
  @ExceptionHandlerDecorator()
  async unsubscribe(@Context() ctx: IContextServer) {
    return this.paymentService.unsubscribe(ctx.req.user.id);
  }
}
