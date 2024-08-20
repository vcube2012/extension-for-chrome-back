import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class ReviewRepoInterface {
  @Field(() => ID)
  id: number;

  @Field()
  author: string;

  @Field()
  text: string;

  @Field(() => ID)
  sort_order: number;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}