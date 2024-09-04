import { Field, Float, ID, InterfaceType, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ZipCodeInterfacePrices {
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
  @Field(() => ID)
  id: number;

  @Field()
  code: string;

  @Field(() => ZipCodeInterfacePrices)
  prices: any;

  @Field({ nullable: true })
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
