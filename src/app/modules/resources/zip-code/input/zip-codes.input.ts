import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ZipCodesInput {
  @Field(() => [String])
  readonly codes: string[];
}
