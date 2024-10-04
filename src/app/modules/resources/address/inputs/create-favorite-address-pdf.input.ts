import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateFavoriteAddressPdfInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  address_id: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  html: string;
}
