import {
  Field,
  Float,
  ID,
  Int,
  InterfaceType,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class PurchaseRange {
  @Field(() => Float, { defaultValue: null })
  from?: number;

  @Field(() => Float, { defaultValue: null })
  to?: number;
}

@ObjectType()
export class Mortgage {
  @Field(() => Float, { defaultValue: null })
  down_payment?: number;

  @Field(() => Float, { defaultValue: null })
  interest_rate?: number;

  @Field(() => Float, { defaultValue: null })
  loan_term?: number;

  @Field(() => Float, { defaultValue: null })
  closing_costs?: number;
}

@ObjectType()
export class Expenses {
  @Field(() => Float, { defaultValue: null })
  property_taxes?: number;

  @Field(() => Float, { defaultValue: null })
  insurance?: number;

  @Field(() => Float, { defaultValue: null })
  hoa_fee?: number;

  @Field(() => Float, { defaultValue: null })
  management?: number;

  @Field(() => Float, { defaultValue: null })
  maintenance?: number;

  @Field(() => Float, { defaultValue: null })
  vacancy?: number;
}

@ObjectType()
export class SettingData {
  @Field(() => PurchaseRange)
  purchase_range: PurchaseRange;

  @Field()
  use_loan: boolean;

  @Field(() => Mortgage)
  mortgage: Mortgage;

  @Field(() => Expenses)
  expenses: Expenses;
}

@InterfaceType()
export class SettingRepoInterface {
  @Field(() => ID)
  readonly id: number;

  @Field(() => Int)
  user_id: number;

  @Field(() => SettingData)
  data: SettingData;

  @Field()
  readonly created_at: Date;

  @Field()
  updated_at: Date;
}
