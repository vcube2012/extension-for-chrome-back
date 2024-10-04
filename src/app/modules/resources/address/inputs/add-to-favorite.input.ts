import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import {
  AddressRepoInfoInterface,
  AddressRepoInterface,
  FavoriteAddressInfoRepoInterface,
} from '../../../../repositories/address/address-repo.interface';

@InputType()
class AddressInputInfo extends PickType(
  AddressRepoInfoInterface,
  ['beds', 'baths', 'square', 'crime_url', 'flood_zone_url'],
  InputType,
) {}

@InputType()
export class AddressInput extends PickType(
  AddressRepoInterface,
  ['address', 'link', 'images'],
  InputType,
) {
  @Field()
  @IsNotEmpty()
  @IsString()
  homeCode: string;

  @Field()
  @IsNotEmpty()
  zipCode: string;

  @Field(() => AddressInputInfo)
  info?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
}

@InputType()
export class FavoriteAddressPricesInput extends PickType(
  FavoriteAddressInfoRepoInterface,
  ['asking', 'offer', 'repairs', 'down', 'cashflow'],
  InputType,
) {}

@InputType()
export class AddToFavoriteInput {
  @Field()
  address: AddressInput;

  @Field()
  prices: FavoriteAddressPricesInput;
}
