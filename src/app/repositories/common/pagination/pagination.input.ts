import { Field, InputType, Int } from '@nestjs/graphql';
import { PER_PAGE } from './pagination.interface';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number;

  @Field(() => Int, { defaultValue: PER_PAGE })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  perPage: number;
}
