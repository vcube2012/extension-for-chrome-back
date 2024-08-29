import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class MakeDepositInput {
  @Field(() => Int)
  @IsNotEmpty()
  payment_system_id: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  package_id: number;
}
