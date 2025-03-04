import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class BuyFreePackageInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  package_id: number;
}
