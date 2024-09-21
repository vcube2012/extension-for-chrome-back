import {
  Field,
  Float,
  ID,
  Int,
  InterfaceType,
  registerEnumType,
} from '@nestjs/graphql';

export enum ReferralBonusType {
  COMMISSION = 'commission',
  WITHDRAWAL = 'withdrawal',
}

registerEnumType(ReferralBonusType, { name: 'ReferralBonusType' });

@InterfaceType()
export class ReferralBonusRepoInterface {
  @Field(() => ID)
  id: any;

  @Field(() => ReferralBonusType)
  type: string;

  @Field(() => Int)
  percent: number;

  @Field(() => Float)
  amount: any;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
