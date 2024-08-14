import { Field, InputType, PickType, registerEnumType } from '@nestjs/graphql';
import { PaginationInput } from '../../../../repositories/common/pagination/pagination.input';

export enum GetFavoritesSortingColumn {
  ADDRESS = 'address',
  LATEST = 'latest',
  ASKING = 'asking',
  OFFER = 'offer',
  DOWN = 'down',
  CASHFLOW = 'cashflow',
  REPAIRS = 'repairs',
}

export enum SortingEnum {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(GetFavoritesSortingColumn, {
  name: 'GetFavoritesSortingColumn',
});
registerEnumType(SortingEnum, { name: 'SortingEnum' });

@InputType()
export class GetFavoritesSorting {
  @Field(() => GetFavoritesSortingColumn, {
    defaultValue: GetFavoritesSortingColumn.LATEST,
  })
  column?: GetFavoritesSortingColumn;

  @Field(() => SortingEnum, { defaultValue: SortingEnum.DESC })
  direction?: SortingEnum;
}

@InputType()
export class GetFavoritesInput extends PickType(
  PaginationInput,
  ['page', 'perPage'],
  InputType,
) {
  @Field({ nullable: true })
  search?: string;

  @Field(() => GetFavoritesSorting, { nullable: true })
  sorting?: GetFavoritesSorting;
}
