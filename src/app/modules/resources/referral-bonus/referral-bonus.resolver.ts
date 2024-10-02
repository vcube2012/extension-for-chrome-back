import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReferralBonusService } from './referral-bonus.service';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { IContextServer } from '../../common/graphql/graphql.module';
import {
  ReferralBonusEntity,
  ReferralBonusesInfo,
} from './entity/referral-bonus.entity';
import { PaginationInput } from '../../../repositories/common/pagination/pagination.input';
import { WithdrawInput } from './inputs/withdraw.input';
import { lowerFirst } from 'lodash';

@UseGuards(AuthGuard)
@Resolver()
export class ReferralBonusResolver {
  constructor(private readonly referralBonusService: ReferralBonusService) {}

  @Query(() => ReferralBonusesInfo)
  @ExceptionHandlerDecorator()
  async getReferralBonuses(
    @Context() ctx: IContextServer,
    @Args('input') input: PaginationInput,
  ): Promise<ReferralBonusesInfo> {
    const userId = ctx.req.user.id;

    const partnerUserInfo =
      await this.referralBonusService.getPartnerPercentAndLink(userId);

    const partnerStatistics =
      await this.referralBonusService.getPartnerStatistics(userId);

    const results = await this.referralBonusService.paginatePartnerBonuses(
      userId,
      input.page,
      input.perPage,
    );

    return {
      results: results,
      statistics: partnerStatistics,
      partnerInfo: partnerUserInfo,
    };
  }

  @Mutation(() => ReferralBonusEntity)
  async withdraw(
    @Context() ctx: IContextServer,
    @Args('input') input: WithdrawInput,
  ) {
    return this.referralBonusService.withdraw(
      ctx.req.user.id,
      input.amount,
      input.credit_card,
    );
  }
}
