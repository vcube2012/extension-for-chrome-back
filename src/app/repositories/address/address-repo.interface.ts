import { Field, Float, ID, Int, InterfaceType } from '@nestjs/graphql';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Prisma } from '.prisma/client';

@InterfaceType()
export class FavoriteAddressInfoRepoInterface {
  @Field(() => Float, { nullable: true, defaultValue: null })
  @IsNumber()
  asking?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  @IsNumber()
  offer?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  @IsNumber()
  down?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  @IsNumber()
  cashflow?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  @IsNumber()
  repairs?: number;
}

@InterfaceType()
export class FavoriteAddressRepoInterface {
  @Field(() => Int)
  @IsNumber()
  user_id: number;

  @Field(() => Int)
  @IsNumber()
  address_id: number;

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
  images: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;

  @Field()
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
