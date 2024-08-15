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
  readonly id: number;

  @Field()
  @MaxLength(255)
  @IsNotEmpty()
  readonly first_name: string;

  @Field()
  @MaxLength(255)
  @IsNotEmpty()
  readonly last_name: string;

  @Field()
  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;
}
