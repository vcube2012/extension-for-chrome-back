import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ZipCodeHouseCodeInput {
  @Field(() => String)
  zipCode: string;

  @Field(() => String)
  houseCode: string;
}

@InputType()
export class ZipCodesInput {
  @Field(() => [ZipCodeHouseCodeInput])
  data: ZipCodeHouseCodeInput[];
}
