import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class MetaTagInterface {
  @Field()
  url: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  updated_at?: Date;
}
