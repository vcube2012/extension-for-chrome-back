import { Field, InputType, PickType } from '@nestjs/graphql';
import {
  Expenses,
  Mortgage,
  PurchaseRange,
  SettingData,
} from '../../../../repositories/setting/setting-repo.interface';
import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

@InputType()
class UpdateSettingDataExpenses extends PickType(
  Expenses,
  [
    'hoa_fee',
    'insurance',
    'property_taxes',
    'maintenance',
    'vacancy',
    'management',
  ],
  InputType,
) {}

@InputType()
class UpdateSettingDataMortgage extends PickType(
  Mortgage,
  ['down_payment', 'closing_costs', 'interest_rate', 'loan_term'],
  InputType,
) {}

@InputType()
class UpdateSettingDataPurchaseRange extends PickType(
  PurchaseRange,
  ['from', 'to'],
  InputType,
) {}

@InputType()
class UpdateSettingData extends PickType(SettingData, ['use_loan'], InputType) {
  @Field(() => UpdateSettingDataPurchaseRange)
  @IsNotEmpty()
  purchase_range: UpdateSettingDataPurchaseRange;

  @Field(() => UpdateSettingDataMortgage)
  @IsNotEmpty()
  mortgage: UpdateSettingDataMortgage;

  @Field(() => UpdateSettingDataExpenses)
  @IsNotEmpty()
  expenses: UpdateSettingDataExpenses;
}

@InputType()
export class UpdateSettingInput {
  @Field(() => UpdateSettingData)
  @IsNotEmpty()
  data: Prisma.JsonNullValueInput | Prisma.InputJsonValue;
}

@InputType()
export class UpdateFmrInput extends PickType(SettingData, ['fmr'], InputType) {}
