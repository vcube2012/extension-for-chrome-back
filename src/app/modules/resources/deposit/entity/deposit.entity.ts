import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { DepositRepoInterface } from '../../../../repositories/deposit/deposit-repo.interface';
import { UserEntity } from '../../user/entity/user.entity';
import { PackageEntity } from '../../package/entity/package.entity';
import { Paginated } from '../../../../repositories/common/pagination/pagination.entity';

@ObjectType()
export class DepositEntity extends OmitType(
  DepositRepoInterface,
  ['updated_at'],
  ObjectType,
) {
  @Field(() => UserEntity, { nullable: true })
  user?: UserEntity;

  @Field(() => PackageEntity, { nullable: true })
  package?: PackageEntity;
}

@ObjectType()
export class PaginatedDeposits extends Paginated(DepositEntity) {}
