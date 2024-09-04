import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { ZipCodeRepoInterface } from '@/src/app/repositories/zip-code/zip-code-repo.interface';

@ObjectType()
export class ZipCodeEntity extends OmitType(
  ZipCodeRepoInterface,
  ['updated_at'],
  ObjectType,
) {}

@ObjectType()
export class ZipCodesWithCredits {
  @Field(() => [ZipCodeEntity])
  zipCodes: ZipCodeEntity[];

  @Field(() => Int)
  credits: number;
}
