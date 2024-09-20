import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class ActivateTrialInput {
  @Field(() => Int)
  @IsInt()
  package_id: number;
}
