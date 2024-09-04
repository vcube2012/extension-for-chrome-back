import { Field, Float, ObjectType, OmitType } from '@nestjs/graphql';
import { FavoriteAddressRepoInterface } from '../../../../repositories/address/address-repo.interface';
import { AddressEntity } from './address.entity';
import { TagEntity } from '../../tag/entity/tag.entity';
import { Paginated } from '../../../../repositories/common/pagination/pagination.entity';

@ObjectType()
export class FavoriteAddressEntity extends OmitType(
  FavoriteAddressRepoInterface,
  ['user_id'],
  ObjectType,
) {
  @Field(() => Float)
  asking: any;

  @Field(() => Float)
  offer: any;

  @Field(() => Float)
  down: any;

  @Field(() => Float)
  cashflow: any;

  @Field(() => Float)
  repairs: any;

  @Field({ nullable: true })
  address?: AddressEntity;

  @Field(() => [TagEntity])
  tags?: [TagEntity];
}

@ObjectType()
export class PaginatedFavoriteAddresses extends Paginated(
  FavoriteAddressEntity,
) {}
