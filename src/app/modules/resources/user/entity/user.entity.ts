import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { UserRepoInterface } from '@/src/app/repositories/user/user-repo.interface';
import { SettingEntity } from '../../setting/entity/setting.entity';
import {
  PartnerEntity,
  ReferralEntity,
} from '../../referral-bonus/entity/referral-bonus.entity';
import { DepositEntity } from '@/src/app/modules/resources/deposit/entity/deposit.entity';
import {
  PackageEntity,
  PackageUserEntity,
} from '@/src/app/modules/resources/package/entity/package.entity';

@ObjectType()
export class UserEntity extends OmitType(
  UserRepoInterface,
  ['updated_at'],
  ObjectType,
) {
  @Field({ nullable: true })
  setting?: SettingEntity;

  @Field({ nullable: true })
  referrer?: PartnerEntity;

  @Field(() => [ReferralEntity])
  referrals?: ReferralEntity[];

  @Field(() => [DepositEntity])
  deposits?: DepositEntity[];

  @Field(() => PackageEntity, { nullable: true })
  currentPackage?: PackageEntity;

  @Field(() => [PackageUserEntity])
  userPackages?: PackageUserEntity[];
}
