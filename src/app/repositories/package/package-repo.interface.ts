import {
  Field,
  Float,
  ID,
  Int,
  InterfaceType,
  registerEnumType,
} from '@nestjs/graphql';

export enum PackageType {
  MONTHLY = 'monthly',
  ANNUALLY = 'annually',
}

registerEnumType(PackageType, { name: 'PackageType' });

@InterfaceType()
export class PackageRepoInterface {
  @Field(() => ID)
  id: number;

  @Field(() => PackageType)
  type: string;

  @Field()
  name: string;

  @Field(() => Int)
  credits: number;

  @Field(() => Float)
  price: any;

  @Field(() => Float, { nullable: true })
  old_price?: any;

  @Field({ defaultValue: false })
  is_active?: boolean;

  @Field({ defaultValue: false })
  is_bestseller?: boolean;

  @Field(() => [String])
  advantages?: any;

  @Field()
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
