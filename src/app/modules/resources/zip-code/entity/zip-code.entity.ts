import { ObjectType, OmitType } from '@nestjs/graphql';
import { ZipCodeRepoInterface } from '@/src/app/repositories/zip-code/zip-code-repo.interface';

@ObjectType()
export class ZipCodeEntity extends OmitType(
  ZipCodeRepoInterface,
  ['updated_at'],
  ObjectType,
) {}
