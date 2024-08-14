import { ObjectType, OmitType } from '@nestjs/graphql';
import { StaticPageRepoInterface } from '../../../../repositories/static-page/static-page-repo.interface';

@ObjectType()
export class StaticPageEntity extends OmitType(
  StaticPageRepoInterface,
  ['updated_at'],
  ObjectType,
) {}
