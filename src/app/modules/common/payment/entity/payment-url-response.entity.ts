import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentUrlResponseEntity {
  @Field()
  url: string;
}
