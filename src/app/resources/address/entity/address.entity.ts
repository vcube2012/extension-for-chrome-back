import { Field, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import {
  AddressRepoInfoInterface,
  AddressRepoInterface,
  FavoriteAddressInfoRepoInterface,
  FavoriteAddressRepoInterface,
} from '../../../repositories/address/address-repo.interface';
import { Prisma } from '@prisma/client';

@ObjectType()
class AddressEntityInfo extends PickType(
  AddressRepoInfoInterface,
  ['beds', 'baths', 'square'],
  ObjectType,
) {}

@ObjectType()
export class AddressEntity extends OmitType(
  AddressRepoInterface,
  ['info'],
  ObjectType,
) {
  @Field(() => AddressEntityInfo)
  info: AddressEntityInfo;
}

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
