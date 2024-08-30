import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { DepositRepoInterface } from '@/src/app/repositories/deposit/deposit-repo.interface';
import { Paginated } from '@/src/app/repositories/common/pagination/pagination.entity';
import { UserEntity } from '@/src/app/modules/resources/user/entity/user.entity';
import { PackageEntity } from '@/src/app/modules/resources/package/entity/package.entity';

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
