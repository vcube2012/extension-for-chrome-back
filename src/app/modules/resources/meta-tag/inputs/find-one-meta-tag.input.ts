import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FindOneMetaTagInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  url: string;
}
