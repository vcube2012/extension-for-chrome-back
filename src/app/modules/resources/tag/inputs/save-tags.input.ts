import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SaveTagsInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  address_id: number;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
