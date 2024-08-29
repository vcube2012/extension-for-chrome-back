import { Field, Float, ID, Int, InterfaceType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';

@InterfaceType()
export class PaymentSystemRepoInterface {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  merchant: string;

  @Field(() => Float, { defaultValue: 0 })
  min_deposit: Decimal;

  @Field()
  is_active: boolean;

  @Field()
  is_card?: boolean;

  @Field(() => Int)
  sort_order: number;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
