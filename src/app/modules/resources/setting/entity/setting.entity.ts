import { Field, ObjectType, PickType } from '@nestjs/graphql';
import {
  Expenses,
  Mortgage,
  PurchaseRange,
  SettingData,
} from '../../../../repositories/setting/setting-repo.interface';

@ObjectType()
class SettingDataExpenses extends PickType(
  Expenses,
  [
    'hoa_fee',
    'insurance',
    'property_taxes',
    'maintenance',
    'vacancy',
    'management',
  ],
  ObjectType,
) {}

@ObjectType()
class SettingDataMortgage extends PickType(
  Mortgage,
  ['down_payment', 'closing_costs', 'interest_rate', 'loan_term'],
  ObjectType,
) {}

@ObjectType()
class SettingDataPurchaseRange extends PickType(
  PurchaseRange,
  ['from', 'to'],
  ObjectType,
) {}

@ObjectType()
class EntitySettingData extends PickType(
  SettingData,
  ['use_loan'],
  ObjectType,
) {
  @Field(() => SettingDataPurchaseRange)
  purchase_range: SettingDataPurchaseRange;

  @Field(() => SettingDataMortgage)
  mortgage: SettingDataMortgage;

  @Field(() => SettingDataExpenses)
  expenses: SettingDataExpenses;
}

@ObjectType()
export class SettingEntity {
  @Field({ nullable: true })
  data?: EntitySettingData;
}
