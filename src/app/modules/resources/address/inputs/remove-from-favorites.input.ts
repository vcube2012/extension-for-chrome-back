import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class RemoveFromFavoritesInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  address_id: number;
}
