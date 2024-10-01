import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class RenewPackageInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  payment_system_id: number;
}
