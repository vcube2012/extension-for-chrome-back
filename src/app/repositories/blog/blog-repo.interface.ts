import { Field, ID, Int, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class BlogRepoInterface {
  @Field(() => ID)
  id: number;

  @Field()
  slug: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  content: string;

  @Field(() => Int, { defaultValue: 0 })
  likes: number;

  @Field(() => Int, { defaultValue: 0 })
  views: number;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
