import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FindOneFavoriteInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  homeCode: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  zipCode: string;
}
