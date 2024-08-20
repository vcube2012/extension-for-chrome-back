import { Field, Int, InterfaceType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
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
  @IsNotEmpty()
  first_name: string;

  @Field()
  @MaxLength(255)
  @IsNotEmpty()
  last_name: string;

  @Field()
  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;

  @Field({ defaultValue: 0 })
  credits: number;

  @Field({ nullable: true })
  package_available_to: Date;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
