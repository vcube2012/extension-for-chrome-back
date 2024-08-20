import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { DepositService } from './deposit.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { IContextServer } from '../../common/graphql/graphql.module';
import { PaginationInput } from '../../../repositories/common/pagination/pagination.input';
import { PaginatedDeposits } from './entity/deposit.entity';

@UseGuards(AuthGuard)
@Resolver()
export class DepositResolver {
  constructor(private readonly depositService: DepositService) {}

  @Query(() => PaginatedDeposits)
  @ExceptionHandlerDecorator()
  async getPaymentsHistory(
    @Args('input') input: PaginationInput,
    @Context() ctx: IContextServer,
  ) {
    return this.depositService.paginateDeposits(
      ctx.req.user.id,
      input.page,
      input.perPage,
    );
  }
}
