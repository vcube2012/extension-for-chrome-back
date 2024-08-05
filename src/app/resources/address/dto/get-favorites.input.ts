import { Field, InputType, PickType, registerEnumType } from '@nestjs/graphql';
import { PaginationInput } from '../../../repositories/common/pagination/pagination.input';

export enum SortingEnum {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortingEnum, { name: 'SortingEnum' });

@InputType()
export class GetFavoritesInput extends PickType(
  PaginationInput,
  ['page', 'perPage'],
  InputType,
) {
  @Field({ nullable: true })
  search?: string;

  @Field(() => SortingEnum, { defaultValue: SortingEnum.DESC })
  sorting: SortingEnum;
}
