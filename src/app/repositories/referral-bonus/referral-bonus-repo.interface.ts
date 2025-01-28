import {
  Field,
  Float,
  ID,
  Int,
  InterfaceType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsCreditCard, IsInt, IsNumber, Max, Min } from 'class-validator';

export enum ReferralBonusType {
  COMMISSION = 'commission',
  WITHDRAWAL = 'withdrawal',
}

export enum WithdrawalStatus {
  REQUESTED = 'requested',
  DONE = 'done',
}

registerEnumType(WithdrawalStatus, { name: 'WithdrawalStatus' });
registerEnumType(ReferralBonusType, { name: 'ReferralBonusType' });

@InterfaceType()
export class ReferralBonusRepoInterface {
  @Field(() => ID)
  id: any;

  @Field(() => ReferralBonusType)
  type: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Max(100)
  @Min(0)
  percent?: number;

  @Field(() => Float)
  @IsNumber()
  amount: any;

  @Field(() => String, { nullable: true })
  @IsCreditCard()
  credit_card?: string;

  @Field(() => WithdrawalStatus, { nullable: true })
  withdrawal_status?: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
