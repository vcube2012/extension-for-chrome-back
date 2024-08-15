import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class FaqRepoInterface {
  @Field()
  id: number;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field()
  sort_order: number;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
