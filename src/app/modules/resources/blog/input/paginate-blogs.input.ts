import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { PaginationInput } from '../../../../repositories/common/pagination/pagination.input';

@InputType()
export class PaginateBlogsInput extends PickType(
  PaginationInput,
  ['page'],
  InputType,
) {
  @Field(() => Int, { defaultValue: 3 })
  perPage: number;
}
