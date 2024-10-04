import { Field, Float, InterfaceType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

@InterfaceType()
export class PurchaseRange {
  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  from?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  to?: number;
}

@InterfaceType()
export class Mortgage {
  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  down_payment?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  interest_rate?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  loan_term?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  closing_costs?: number;
}

@InterfaceType()
export class Expenses {
  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  property_taxes?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  insurance?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  hoa_fee?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  management?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  maintenance?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  @IsOptional()
  vacancy?: number;
}

@InterfaceType()
export class SettingData {
  @Field(() => PurchaseRange)
  @IsNotEmpty()
  purchase_range: PurchaseRange;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean({ message: 'Field use_load must be boolean type' })
  @IsNotEmpty()
  use_loan: boolean;

  @Field(() => Mortgage)
  @IsNotEmpty()
  mortgage: Mortgage;

  @Field(() => Expenses)
  @IsNotEmpty()
  expenses: Expenses;

  @Field(() => Float, { nullable: null, defaultValue: 100 })
  @IsOptional()
  @Min(50)
  @Max(200)
  fmr?: number;
}
