import { ObjectType, OmitType } from '@nestjs/graphql';
import { FaqRepoInterface } from '../../../../repositories/faq/faq-repo.interface';

@ObjectType()
export class FaqEntity extends OmitType(
  FaqRepoInterface,
  ['updated_at', 'sort_order'],
  ObjectType,
) {}
