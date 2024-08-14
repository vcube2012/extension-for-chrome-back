import { ObjectType, OmitType } from '@nestjs/graphql';
import { PackageRepoInterface } from '../../../../repositories/package/package-repo.interface';

@ObjectType()
export class PackageEntity extends OmitType(
  PackageRepoInterface,
  ['updated_at'],
  ObjectType,
) {}
