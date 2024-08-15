import { ObjectType, OmitType } from '@nestjs/graphql';
import { ReviewRepoInterface } from '../../../../repositories/review/review-repo.interface';

@ObjectType()
export class ReviewEntity extends OmitType(
  ReviewRepoInterface,
  ['updated_at', 'sort_order'],
  ObjectType,
) {}
