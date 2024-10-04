import { ObjectType, OmitType } from '@nestjs/graphql';
import { MetaTagInterface } from '../interfaces/meta-tag.interface';

@ObjectType()
export class MetaTagEntity extends OmitType(
  MetaTagInterface,
  ['updated_at'],
  ObjectType,
) {}
