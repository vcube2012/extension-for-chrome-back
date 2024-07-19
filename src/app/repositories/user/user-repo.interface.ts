import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Prisma } from '@prisma/client';

@InterfaceType()
export class UserRepoInterface implements Prisma.UserUncheckedCreateInput {
  @Field(() => Int)
  readonly id: number;

  @Field()
  @MaxLength(500)
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @MaxLength(255)
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Field()
  readonly created_at: Date;

  @Field()
  readonly updated_at: Date;
}
