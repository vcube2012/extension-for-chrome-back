import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class StaticPageRepoInterface {
  @Field(() => ID)
  id: number;

  @Field()
  slug: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
