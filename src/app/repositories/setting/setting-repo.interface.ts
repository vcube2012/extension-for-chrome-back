import { Field, Float, InterfaceType } from '@nestjs/graphql';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

@InterfaceType()
export class PurchaseRange {
  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  from?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  to?: number;
}

@InterfaceType()
export class Mortgage {
  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  down_payment?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  interest_rate?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  loan_term?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  closing_costs?: number;
}

@InterfaceType()
export class Expenses {
  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  property_taxes?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  insurance?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  hoa_fee?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  management?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  maintenance?: number;

  @Field(() => Float, { defaultValue: null, nullable: true })
  @IsNumber()
  vacancy?: number;
}

@InterfaceType()
export class SettingData {
  @Field(() => PurchaseRange)
  purchase_range: PurchaseRange;

  @Field({ defaultValue: false })
  use_loan: boolean;

  @Field(() => Mortgage)
  mortgage: Mortgage;

  @Field(() => Expenses)
  expenses: Expenses;

  @Field(() => Float, { nullable: null, defaultValue: 100 })
  @IsOptional()
  @Min(50)
  @Max(200)
  fmr?: number;
}
