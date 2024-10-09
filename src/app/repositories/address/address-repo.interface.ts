import { Field, Float, ID, Int, InterfaceType } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Prisma } from '.prisma/client';
import { FmrData } from '../../modules/resources/address/entity/favorite-address.entity';

@InterfaceType()
export class FavoriteAddressInfoRepoInterface {
  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  asking: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  offer: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  down: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  cashflow: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  repairs: number;
}

@InterfaceType()
export class FavoriteAddressRepoInterface {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  address_id: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  asking: any;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  offer: any;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  down: any;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  cashflow: any;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  repairs: any;

  @Field(() => FmrData)
  @IsNotEmpty()
  fmr_info: any;

  @Field()
  @IsDate()
  created_at?: Date;

  @Field({ nullable: true })
  @IsDate()
  updated_at?: Date;
}

@InterfaceType()
export class AddressRepoInfoInterface {
  @Field(() => Float, { nullable: true, defaultValue: null })
  @IsNumber()
  @IsOptional()
  beds?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  @IsNumber()
  @IsOptional()
  baths?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  @IsNumber()
  @IsOptional()
  square?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  crime_url?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  flood_zone_url?: string;
}

@InterfaceType()
export class AddressRepoInterface {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  zip_code_id: number;

  @Field(() => String, { nullable: true })
  home_code?: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  address: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  link: string;

  @Field(() => AddressRepoInfoInterface)
  @IsNotEmpty()
  info: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images: any;

  @Field()
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
