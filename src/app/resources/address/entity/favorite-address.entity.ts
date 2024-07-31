import { Field, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import {
  FavoriteAddressInfoRepoInterface,
  FavoriteAddressRepoInterface,
} from '../../../repositories/address/address-repo.interface';
import { Prisma } from '@prisma/client';
import { Paginated } from '../../../repositories/common/pagination/pagination.entity';
import { AddressEntity } from './address.entity';

@ObjectType()
class FavoriteAddressEntityInfo extends PickType(
  FavoriteAddressInfoRepoInterface,
  ['asking', 'down', 'cashflow', 'offer', 'repairs'],
  ObjectType,
) {}

@ObjectType()
export class FavoriteAddressEntity extends OmitType(
  FavoriteAddressRepoInterface,
  ['userId', 'addressId'],
  ObjectType,
) {
  @Field(() => FavoriteAddressEntityInfo)
  info: Prisma.JsonNullValueInput | Prisma.InputJsonValue;

  @Field({ nullable: true })
  address?: AddressEntity;
}

@ObjectType()
export class PaginatedFavoriteAddresses extends Paginated(
  FavoriteAddressEntity,
) {}
