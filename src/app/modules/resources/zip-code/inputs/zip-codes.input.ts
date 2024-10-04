import { Field, InputType } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ZipCodeHouseCodeInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  houseCode: string;
}

@InputType()
export class ZipCodesInput {
  @Field(() => [ZipCodeHouseCodeInput])
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  data: ZipCodeHouseCodeInput[];
}
