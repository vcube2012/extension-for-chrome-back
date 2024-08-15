import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
import { ReferralBonusService } from './referral-bonus.service';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { IContextServer } from '../../common/graphql/graphql.module';
import {
  PaginatedReferralBonuses,
  PartnerStatisticsEntity,
} from './entity/referral-bonus.entity';
import { PaginationInput } from '../../../repositories/common/pagination/pagination.input';

@UseGuards(AuthGuard)
@Resolver()
export class ReferralBonusResolver {
  constructor(private readonly referralBonusService: ReferralBonusService) {}

  @Query(() => PaginatedReferralBonuses)
  @ExceptionHandlerDecorator()
  async getReferralBonuses(
    @Context() ctx: IContextServer,
    @Args('input') input: PaginationInput,
  ) {
    return this.referralBonusService.paginatePartnerBonuses(
      ctx.req.user.id,
      input.page,
      input.perPage,
    );
  }

  @Query(() => PartnerStatisticsEntity)
  @ExceptionHandlerDecorator()
  async getPartnerStatistics(@Context() ctx: IContextServer) {
    return this.referralBonusService.getPartnerStatistics(ctx.req.user.id);
  }
}
