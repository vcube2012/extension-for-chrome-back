import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FindBlogInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  slug: string;
}
