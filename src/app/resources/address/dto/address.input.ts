import { Field, InputType, PickType } from '@nestjs/graphql';
import {
  AddressRepoInfoInterface,
  AddressRepoInterface,
} from '../../../repositories/address/address-repo.interface';
import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

@InputType()
class AddressInputInfo extends PickType(
  AddressRepoInfoInterface,
  ['beds', 'baths', 'square'],
  InputType,
) {}

@InputType()
export class AddressInput extends PickType(
  AddressRepoInterface,
  ['address'],
  InputType,
) {
  @Field()
  @IsNotEmpty()
  zipCode: string;

  @Field(() => AddressInputInfo)
  info?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
}
