import { Field, Float, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class DepositRepoInterface {
  @Field(() => ID)
  id: number;

  @Field()
  type: string;

  @Field(() => Float)
  amount: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  payment_id?: string;

  @Field({ nullable: true })
  error?: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
