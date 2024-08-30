import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class FindOneFavoriteInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  addressId: number;
}
