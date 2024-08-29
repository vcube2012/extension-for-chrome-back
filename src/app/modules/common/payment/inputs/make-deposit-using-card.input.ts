import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsCreditCard,
  IsInt,
  IsNotEmpty,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

@InputType()
export class MakeDepositUsingCardInput {
  @Field(() => Int)
  @IsNotEmpty()
  payment_system_id: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  package_id: number;

  @Field()
  @IsNotEmpty()
  holder: string;

  @Field()
  @IsNotEmpty()
  @IsCreditCard()
  pan: string;

  @Field()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  expMonth: string;

  @Field()
  @IsNotEmpty()
  @IsInt()
  expYear: number;

  @Field()
  @IsNotEmpty()
  @Min(100)
  @Max(999)
  cvv: number;
}
