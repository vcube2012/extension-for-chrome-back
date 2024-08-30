import { Field, Float, ObjectType, OmitType } from '@nestjs/graphql';
import { FavoriteAddressRepoInterface } from '@/src/app/repositories/address/address-repo.interface';
import { Paginated } from '@/src/app/repositories/common/pagination/pagination.entity';
import { AddressEntity } from '@/src/app/modules/resources/address/entity/address.entity';
import { TagEntity } from '@/src/app/modules/resources/tag/entity/tag.entity';

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
