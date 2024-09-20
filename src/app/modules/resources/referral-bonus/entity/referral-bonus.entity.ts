import { Field, Float, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { UserRepoInterface } from '../../../../repositories/user/user-repo.interface';
import { ReferralBonusRepoInterface } from '../../../../repositories/referral-bonus/referral-bonus-repo.interface';
import { Paginated } from '../../../../repositories/common/pagination/pagination.entity';

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
export class PartnerInfoEntity {
  @Field(() => Int)
  partnerPercent: number;

  @Field(() => String)
  username: string;
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
export class ReferralBonusesInfo {
  @Field(() => PaginatedReferralBonuses)
  results: any;

  @Field(() => PartnerStatisticsEntity)
  statistics: any;

  @Field(() => PartnerInfoEntity)
  partnerInfo: any;
}

@ObjectType()
export class PaginatedReferralBonuses extends Paginated(ReferralBonusEntity) {}
