import { Field, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import {
  AddressRepoInfoInterface,
  AddressRepoInterface,
} from '../../../../repositories/address/address-repo.interface';

@ObjectType()
class AddressEntityInfo extends PickType(
  AddressRepoInfoInterface,
  ['beds', 'baths', 'square', 'crime_url', 'flood_zone_url'],
  ObjectType,
) {}

@ObjectType()
export class AddressEntity extends OmitType(
  AddressRepoInterface,
  ['info'],
  ObjectType,
) {
  @Field(() => AddressEntityInfo)
  info: any;
}
