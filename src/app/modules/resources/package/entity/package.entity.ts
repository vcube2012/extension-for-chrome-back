import {
  Field,
  ID,
  Int,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { PackageRepoInterface } from '../../../../repositories/package/package-repo.interface';
import { UserEntity } from '../../user/entity/user.entity';

@ObjectType()
export class PackageEntity extends OmitType(
  PackageRepoInterface,
  ['updated_at'],
  ObjectType,
) {}

@ObjectType()
export class PackageUserEntity extends PickType(
  PackageRepoInterface,
  ['credits', 'price', 'created_at', 'is_trial', 'is_active'],
  ObjectType,
) {
  @Field(() => ID)
  id?: any;

  @Field(() => Int)
  package_id?: number;

  @Field(() => Int)
  user_id?: number;

  @Field(() => Date)
  available_to: Date;

  @Field(() => PackageEntity)
  package?: PackageEntity;

  @Field(() => UserEntity)
  user?: UserEntity;
}
