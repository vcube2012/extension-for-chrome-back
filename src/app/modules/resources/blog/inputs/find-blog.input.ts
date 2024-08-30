import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindBlogInput {
  @Field()
  slug: string;
}
