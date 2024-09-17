import {
  Field,
  Float,
  ID,
  Int,
  InterfaceType,
  registerEnumType,
} from '@nestjs/graphql';

export enum DepositType {
  NEW = 'new',
  RENEWAL = 'renewal',
}

export enum DepositStatus {
  SUCCESS = 'success',
  WAITING = 'waiting',
  FAILED = 'failed',
  TEMP = 'temp',
}

registerEnumType(DepositType, { name: 'DepositType' });
registerEnumType(DepositStatus, { name: 'DepositStatus' });

@InterfaceType()
export class DepositRepoInterface {
  @Field(() => ID)
  id: any;

  @Field(() => Int)
  user_id: number;

  @Field(() => DepositType)
  type: string;

  @Field(() => Float)
  amount: any;

  @Field(() => DepositStatus)
  status: string;

  @Field({ nullable: true })
  payment_id?: string;

  @Field({ nullable: true })
  error?: string;

  @Field()
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
