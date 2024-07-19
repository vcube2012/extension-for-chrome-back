import { Field, Float, InterfaceType, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ZipCodeInterfacePrices {
  @Field(() => Float, { defaultValue: 0 })
  efficiency: number;

  @Field(() => Float, { defaultValue: 0 })
  one_bedroom: number;

  @Field(() => Float, { defaultValue: 0 })
  two_bedroom: number;

  @Field(() => Float, { defaultValue: 0 })
  three_bedroom: number;

  @Field(() => Float, { defaultValue: 0 })
  four_bedroom: number;
}

@InterfaceType()
export class ZipCodeRepoInterface {
  @Field()
  readonly id: number;

  @Field()
  readonly code: string;

  @Field(() => ZipCodeInterfacePrices)
  readonly prices: ZipCodeInterfacePrices;

  @Field()
  readonly created_at: Date;

  @Field()
  readonly updated_at: Date;
}
