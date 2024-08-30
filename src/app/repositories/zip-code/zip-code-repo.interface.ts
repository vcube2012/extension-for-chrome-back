import { Field, Float, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class ZipCodeRepoInterface {
  @Field(() => ID)
  id: number;

  @Field()
  code: string;

  @Field(() => Float)
  price: any;

  @Field({ nullable: true })
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
