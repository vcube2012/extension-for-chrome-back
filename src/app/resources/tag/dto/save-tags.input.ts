import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SaveTagsInput {
  @Field(() => Int)
  address_id: number;

  @Field(() => [String])
  tags: string[];
}
