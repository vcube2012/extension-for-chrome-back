import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { SettingEntity } from '../../setting/entity/setting.entity';
import { UserRepoInterface } from '../../../../repositories/user/user-repo.interface';
import {
  PackageEntity,
  PackageUserEntity,
} from '../../package/entity/package.entity';

@ObjectType()
export class UserEntity extends OmitType(
  UserRepoInterface,
  ['updated_at'],
  ObjectType,
) {
  @Field(() => Boolean, { defaultValue: false })
  can_activate_trial?: boolean;

  @Field(() => SettingEntity, { nullable: true })
  setting?: SettingEntity;

  @Field(() => PackageEntity, { nullable: true })
  currentPackage?: PackageEntity;

  @Field(() => [PackageUserEntity])
  userPackages?: PackageUserEntity[];
}
