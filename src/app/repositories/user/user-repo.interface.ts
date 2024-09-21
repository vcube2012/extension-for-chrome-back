import { Field, Int, InterfaceType, registerEnumType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Prisma } from '@prisma/client';

export enum SocialAuthType {
  GOOGLE = 'google',
}

registerEnumType(SocialAuthType, { name: 'SocialAuthType' });

@InterfaceType()
export class UserRepoInterface implements Prisma.UserUncheckedCreateInput {
  @Field(() => Int)
  id: number;

  @Field()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @Field()
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @Field()
  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string;

  @Field({ defaultValue: 0 })
  credits: number;

  @Field({ nullable: true })
  package_available_to: Date;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(255)
  username?: string;

  @Field(() => Int, { nullable: true })
  @Max(100)
  @Min(0)
  partner_percent?: number;

  @Field(() => Int, { nullable: true })
  referrer_id?: number;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
