import { InputType, PickType } from '@nestjs/graphql';
import { ZipCodeInterface } from '../interface/zip-code.interface';

@InputType()
export class ZipCodeDto extends PickType(
  ZipCodeInterface,
  ['code'],
  InputType,
) {}
