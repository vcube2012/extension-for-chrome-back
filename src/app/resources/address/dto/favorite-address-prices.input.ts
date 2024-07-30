import { InputType, PickType } from '@nestjs/graphql';
import { FavoriteAddressInfoRepoInterface } from '../../../repositories/address/address-repo.interface';

@InputType()
export class FavoriteAddressPricesInput extends PickType(
  FavoriteAddressInfoRepoInterface,
  ['asking', 'offer', 'repairs', 'down', 'cashflow'],
  InputType,
) {}
