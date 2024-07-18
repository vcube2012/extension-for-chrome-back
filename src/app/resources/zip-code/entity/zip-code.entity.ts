import { ObjectType, OmitType } from '@nestjs/graphql';
import { ZipCodeInterface } from '../interface/zip-code.interface';

@ObjectType()
export class ZipCodeEntity extends OmitType(
  ZipCodeInterface,
  ['updated_at'],
  ObjectType,
) {}
