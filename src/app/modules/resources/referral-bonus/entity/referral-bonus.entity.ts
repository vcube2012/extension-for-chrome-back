import { Field, Float, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { ReferralBonusRepoInterface } from '../../../../repositories/referral-bonus/referral-bonus-repo.interface';
import { Paginated } from '../../../../repositories/common/pagination/pagination.entity';
import { UserRepoInterface } from '../../../../repositories/user/user-repo.interface';

@ObjectType()
export class ReferralEntity extends OmitType(
  UserRepoInterface,
  ['updated_at'],
  ObjectType,
) {}

@ObjectType()
export class PartnerEntity extends OmitType(
  UserRepoInterface,
  ['updated_at'],
  ObjectType,
) {}

@ObjectType()
export class ReferralBonusEntity extends OmitType(
  ReferralBonusRepoInterface,
  ['updated_at'],
  ObjectType,
) {
  @Field(() => PartnerEntity)
  partner: PartnerEntity;

  @Field(() => ReferralEntity, { nullable: true })
  referral?: ReferralEntity;
}

@ObjectType()
export class PartnerStatisticsEntity {
  @Field(() => Float)
  balance: number;

  @Field(() => Float)
  totalEarnings: number;

  @Field(() => Int)
  referralsCount: number;
}

@ObjectType()
export class PaginatedReferralBonuses extends Paginated(ReferralBonusEntity) {}
