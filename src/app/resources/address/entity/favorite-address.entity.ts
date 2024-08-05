import { Field, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import {
  FavoriteAddressInfoRepoInterface,
  FavoriteAddressRepoInterface,
} from '../../../repositories/address/address-repo.interface';
import { Prisma } from '@prisma/client';
import { Paginated } from '../../../repositories/common/pagination/pagination.entity';
import { AddressEntity } from './address.entity';
import { TagEntity } from '../../tag/entity/tag.entity';

@ObjectType()
class FavoriteAddressEntityInfo extends PickType(
  FavoriteAddressInfoRepoInterface,
  ['asking', 'down', 'cashflow', 'offer', 'repairs'],
  ObjectType,
) {}

@ObjectType()
export class FavoriteAddressEntity extends OmitType(
  FavoriteAddressRepoInterface,
  ['user_id', 'address_id'],
  ObjectType,
) {
  @Field(() => FavoriteAddressEntityInfo)
  info: Prisma.JsonNullValueInput | Prisma.InputJsonValue;

  @Field({ nullable: true })
  address?: AddressEntity;

  @Field(() => [TagEntity], { nullable: true })
  tags?: [TagEntity];
}

@ObjectType()
export class PaginatedFavoriteAddresses extends Paginated(
  FavoriteAddressEntity,
) {}
