import { Field, InputType, Int } from '@nestjs/graphql';
import { PER_PAGE } from './pagination.interface';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: PER_PAGE })
  perPage: number;
}
