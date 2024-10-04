import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FindOneMetaTagInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  url: string;
}
