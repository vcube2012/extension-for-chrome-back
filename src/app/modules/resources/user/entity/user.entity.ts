import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { UserRepoInterface } from '../../../../repositories/user/user-repo.interface';
import { SettingEntity } from '../../setting/entity/setting.entity';
import {
  PartnerEntity,
  ReferralEntity,
} from '../../referral-bonus/entity/referral-bonus.entity';

@ObjectType()
export class UserEntity extends OmitType(
  UserRepoInterface,
  ['updated_at'],
  ObjectType,
) {
  @Field({ nullable: true })
  setting: SettingEntity;

  @Field({ nullable: true })
  referrer: PartnerEntity;

  @Field(() => [ReferralEntity])
  referrals: [ReferralEntity];
}
