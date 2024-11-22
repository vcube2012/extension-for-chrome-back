import { Field, Float, InterfaceType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InterfaceType()
export class PurchaseRange {
  @Field(() => Float, { defaultValue: 20000, nullable: true })
  @IsNumber()
  @IsOptional()
  from?: number;

  @Field(() => Float, { defaultValue: 100000, nullable: true })
  @IsNumber()
  @IsOptional()
  to?: number;
}

@InterfaceType()
export class Mortgage {
  @Field(() => Float, { defaultValue: 20, nullable: true })
  @IsNumber()
  @IsOptional()
  down_payment?: number;

  @Field(() => Float, { defaultValue: 7.5, nullable: true })
  @IsNumber()
  @IsOptional()
  interest_rate?: number;

  @Field(() => Float, { defaultValue: 30, nullable: true })
  @IsNumber()
  @IsOptional()
  loan_term?: number;

  @Field(() => Float, { defaultValue: 3000, nullable: true })
  @IsNumber()
  @IsOptional()
  closing_costs?: number;
}

@InterfaceType()
export class Expenses {
  @Field(() => Float, { defaultValue: 1200, nullable: true })
  @IsNumber()
  @IsOptional()
  property_taxes?: number;

  @Field(() => Float, { defaultValue: 60, nullable: true })
  @IsNumber()
  @IsOptional()
  insurance?: number;

  @Field(() => Float, { defaultValue: 0, nullable: true })
  @IsNumber()
  @IsOptional()
  hoa_fee?: number;

  @Field(() => Float, { defaultValue: 10, nullable: true })
  @IsNumber()
  @IsOptional()
  management?: number;

  @Field(() => Float, { defaultValue: 10, nullable: true })
  @IsNumber()
  @IsOptional()
  maintenance?: number;

  @Field(() => Float, { defaultValue: 5, nullable: true })
  @IsNumber()
  @IsOptional()
  vacancy?: number;
}

@InterfaceType()
export class SettingData {
  @Field(() => PurchaseRange)
  @IsNotEmpty()
  purchase_range: PurchaseRange;

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean({ message: 'Field use_load must be boolean type' })
  @IsNotEmpty()
  use_loan: boolean;

  @Field(() => Mortgage)
  @IsNotEmpty()
  mortgage: Mortgage;

  @Field(() => Expenses)
  @IsNotEmpty()
  expenses: Expenses;
}
