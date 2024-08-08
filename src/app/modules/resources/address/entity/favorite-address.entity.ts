import { Field, Float, ObjectType, OmitType } from '@nestjs/graphql';
import { FavoriteAddressRepoInterface } from '../../../../repositories/address/address-repo.interface';
import { Paginated } from '../../../../repositories/common/pagination/pagination.entity';
import { AddressEntity } from './address.entity';
import { TagEntity } from '../../tag/entity/tag.entity';

@ObjectType()
export class FavoriteAddressEntity extends OmitType(
  FavoriteAddressRepoInterface,
  ['user_id', 'address_id'],
  ObjectType,
) {
  @Field(() => Float)
  asking: number;

  @Field(() => Float)
  offer: number;

  @Field(() => Float)
  down: number;

  @Field(() => Float)
  cashflow: number;

  @Field(() => Float)
  repairs: number;

  @Field({ nullable: true })
  address?: AddressEntity;

  @Field(() => [TagEntity], { defaultValue: [] })
  tags: [TagEntity];
}

@ObjectType()
export class PaginatedFavoriteAddresses extends Paginated(
  FavoriteAddressEntity,
) {}
