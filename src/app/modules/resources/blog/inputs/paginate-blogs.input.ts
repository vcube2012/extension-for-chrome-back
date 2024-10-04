import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { PaginationInput } from '../../../../repositories/common/pagination/pagination.input';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

@InputType()
export class PaginateBlogsInput extends PickType(
  PaginationInput,
  ['page'],
  InputType,
) {
  @Field(() => Int, { defaultValue: 3 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  perPage: number;
}
