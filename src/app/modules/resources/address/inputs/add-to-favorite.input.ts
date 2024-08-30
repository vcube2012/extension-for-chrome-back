import { Field, InputType, PickType } from '@nestjs/graphql';
import {
  AddressRepoInfoInterface,
  AddressRepoInterface,
  FavoriteAddressInfoRepoInterface,
} from '@/src/app/repositories/address/address-repo.interface';
import { IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

@InputType()
class AddressInputInfo extends PickType(
  AddressRepoInfoInterface,
  ['beds', 'baths', 'square'],
  InputType,
) {}

@InputType()
export class AddressInput extends PickType(
  AddressRepoInterface,
  ['address', 'link'],
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
