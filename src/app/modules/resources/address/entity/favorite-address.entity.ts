import { Field, Float, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { FavoriteAddressRepoInterface } from '../../../../repositories/address/address-repo.interface';
import { AddressEntity } from './address.entity';
import { TagEntity } from '../../tag/entity/tag.entity';
import { Paginated } from '../../../../repositories/common/pagination/pagination.entity';
import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { UserEntity } from '../../user/entity/user.entity';

@ObjectType()
export class FavoriteAddressEntity extends OmitType(
  FavoriteAddressRepoInterface,
  ['user_id'],
  ObjectType,
) {
  @Field(() => AddressEntity, { nullable: true })
  @IsOptional()
  address?: any;

  @Field(() => UserEntity, { nullable: true })
  @IsOptional()
  user?: any;

  @Field(() => [TagEntity])
  @IsOptional()
  tags?: any[];
}

@ObjectType()
export class FmrData {
  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  percent: number;
}

@ObjectType()
export class PaginatedFavoriteAddresses extends Paginated(
  FavoriteAddressEntity,
) {}
