import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  ['address', 'link'],
  InputType,
) {
  @Field()
  @IsNotEmpty()
  @IsString()
  homeCode: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @Field(() => AddressInputInfo)
  @IsOptional()
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
  @IsNotEmpty()
  @Field(() => AddressInput)
  address: AddressInput;

  @IsNotEmpty()
  @Field(() => FavoriteAddressPricesInput)
  prices: FavoriteAddressPricesInput;
}
