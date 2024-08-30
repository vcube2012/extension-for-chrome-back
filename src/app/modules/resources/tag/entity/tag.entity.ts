import { ObjectType, OmitType } from '@nestjs/graphql';
import { TagRepoInterface } from '@/src/app/repositories/tag/tag-repo.interface';

@ObjectType()
export class TagEntity extends OmitType(
  TagRepoInterface,
  ['updated_at'],
  ObjectType,
) {}
