import {
  Field,
  Float,
  ID,
  Int,
  InterfaceType,
  registerEnumType,
} from '@nestjs/graphql';

enum PackageType {
  MONTHLY = 'MONTHLY',
  ANNUALLY = 'ANNUALLY',
}

registerEnumType(PackageType, { name: 'PackageType' });

@InterfaceType()
export class PackageRepoInterface {
  @Field(() => ID)
  id: number;

  @Field(() => PackageType)
  type: PackageType;

  @Field()
  name: string;

  @Field(() => Int)
  requests_limit: number;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  old_price?: number;

  @Field({ defaultValue: false })
  is_active: boolean;

  @Field({ defaultValue: false })
  is_bestseller: boolean;

  @Field(() => [String])
  advantages: any;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
