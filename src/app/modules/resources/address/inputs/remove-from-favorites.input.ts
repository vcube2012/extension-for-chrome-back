import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RemoveFromFavoritesInput {
  @Field(() => Int)
  address_id: number;
}
