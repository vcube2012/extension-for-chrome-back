import { InputType, PickType } from '@nestjs/graphql';
import { PaginationInput } from '../../../repositories/common/pagination/pagination.input';

@InputType()
export class GetFavoritesInput extends PickType(
  PaginationInput,
  ['page', 'perPage'],
  InputType,
) {}
