import { ObjectType, OmitType } from '@nestjs/graphql';
import { ZipCodeRepoInterface } from '../../../repositories/zip-code/zip-code-repo.interface';

@ObjectType()
export class ZipCodeEntity extends OmitType(
  ZipCodeRepoInterface,
  ['updated_at'],
  ObjectType,
) {}
