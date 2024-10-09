import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import {
  AddressRepoInfoInterface,
  AddressRepoInterface,
  FavoriteAddressInfoRepoInterface,
} from '../../../../repositories/address/address-repo.interface';
import { FmrData } from '../entity/favorite-address.entity';

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
) {
  @Field(() => FavoriteAddressPricesFmrInput)
  @IsNotEmpty()
  fmr_info: any;
}

@InputType()
export class FavoriteAddressPricesFmrInput extends PickType(
  FmrData,
  ['price', 'percent'],
  InputType,
) {}

@InputType()
export class AddToFavoriteInput {
  @Field(() => AddressInput)
  @IsNotEmpty()
  address: AddressInput;

  @Field(() => FavoriteAddressPricesInput)
  @IsNotEmpty()
  prices: FavoriteAddressPricesInput;
}
