import { Field, ID, InterfaceType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InterfaceType()
export class TagRepoInterface {
  @Field(() => ID)
  readonly id: number;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
