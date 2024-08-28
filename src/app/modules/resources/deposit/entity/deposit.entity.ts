import { ObjectType, OmitType } from '@nestjs/graphql';
import { DepositRepoInterface } from '@/src/app/repositories/deposit/deposit-repo.interface';
import { Paginated } from '@/src/app/repositories/common/pagination/pagination.entity';

@ObjectType()
export class DepositEntity extends OmitType(
  DepositRepoInterface,
  ['updated_at'],
  ObjectType,
) {}

@ObjectType()
export class PaginatedDeposits extends Paginated(DepositEntity) {}
