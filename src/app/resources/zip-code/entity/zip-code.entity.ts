import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { ZipCodeInterface } from '../interface/zip-code.interface';

@ObjectType()
export class ZipCode extends OmitType(
  ZipCodeInterface,
  ['updated_at'],
  ObjectType,
) {}

@ObjectType()
export class Prices {
  @Field()
  efficiency: number;

  @Field()
  one_bedroom: number;

  @Field()
  two_bedroom: number;

  @Field()
  three_bedroom: number;

  @Field()
  four_bedroom: number;
}
