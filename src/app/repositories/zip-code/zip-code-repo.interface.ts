import { Field, Float, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class ZipCodeRepoInterface {
  @Field()
  readonly id: number;

  @Field()
  readonly code: string;

  @Field(() => Float)
  readonly price: number;

  @Field()
  readonly created_at: Date;

  @Field()
  readonly updated_at: Date;
}
