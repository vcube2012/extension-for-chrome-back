import { Field, Float, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class ZipCodeRepoInterface {
  @Field(() => ID)
  id: number;

  @Field()
  code: string;

  @Field(() => Float)
  price: number;

  @Field()
  readonly created_at: Date;

  @Field()
  readonly updated_at: Date;
}
