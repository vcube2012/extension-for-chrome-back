import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ZipCodesDto {
  @Field(() => [String])
  readonly codes: string[];
}
