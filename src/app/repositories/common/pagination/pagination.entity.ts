import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface IPaginatedType<T> {
  data: T[];
  meta: PaginationMeta;
}

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  lastPage: number;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  perPage: number;

  @Field(() => Int)
  count: number;

  @Field()
  hasMorePages: boolean;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  class PaginatedType implements IPaginatedType<T> {
    @Field(() => [classRef], { defaultValue: [] })
    data: T[];

    @Field(() => PaginationMeta)
    meta: PaginationMeta;
  }

  return PaginatedType as Type<IPaginatedType<T>>;
}
