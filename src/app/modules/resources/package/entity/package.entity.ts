import { Field, ID, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { PackageRepoInterface } from '../../../../repositories/package/package-repo.interface';
import { UserEntity } from '../../user/entity/user.entity';

@ObjectType()
export class PackageEntity extends OmitType(
  PackageRepoInterface,
  ['updated_at'],
  ObjectType,
) {}

@ObjectType()
export class PackageUserEntity {
  @Field(() => ID)
  id?: any;

  @Field(() => Int)
  package_id?: number;

  @Field(() => Int)
  user_id?: number;

  @Field()
  is_active?: boolean;

  @Field()
  is_trial?: boolean;

  @Field(() => Int)
  credits?: number;

  @Field(() => PackageEntity)
  package?: PackageEntity;

  @Field(() => UserEntity)
  user?: UserEntity;
}
