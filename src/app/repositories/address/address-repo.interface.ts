import { Field, Float, ID, Int, InterfaceType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Prisma } from '.prisma/client';

@InterfaceType()
export class FavoriteAddressInfoRepoInterface {
  @Field(() => Float, { nullable: true, defaultValue: null })
  asking?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  offer?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  down?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  cashflow?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  repairs?: number;
}

@InterfaceType()
export class FavoriteAddressRepoInterface {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  address_id: number;

  @Field()
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}

@InterfaceType()
export class AddressRepoInfoInterface {
  @Field(() => Int, { nullable: true, defaultValue: null })
  beds?: number;

  @Field(() => Int, { nullable: true, defaultValue: null })
  baths?: number;

  @Field(() => Float, { nullable: true, defaultValue: null })
  square?: number;
}

@InterfaceType()
export class AddressRepoInterface {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  zip_code_id: number;

  @Field(() => String, { nullable: true })
  home_code?: string;

  @Field()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsNotEmpty()
  link: string;

  @Field(() => AddressRepoInfoInterface)
  @IsNotEmpty()
  info: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;

  @Field()
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
