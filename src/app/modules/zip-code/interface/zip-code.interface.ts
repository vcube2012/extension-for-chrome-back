import { Field, InterfaceType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InterfaceType()
export class ZipCodeInterface {
  @Field()
  readonly id: number;

  @Field()
  readonly code: string;

  @Field(() => GraphQLJSON)
  readonly prices: JSON;

  @Field()
  readonly created_at: Date;

  @Field()
  readonly updated_at: Date;
}
