import { Field, Float, InputType } from '@nestjs/graphql';
import { IsCreditCard, IsNotEmpty, IsNumber, Min } from 'class-validator';

@InputType()
export class WithdrawInput {
  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @Field()
  @IsCreditCard()
  @IsNotEmpty()
  credit_card: string;
}
