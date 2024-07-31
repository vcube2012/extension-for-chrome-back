import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { AddressService } from './address.service';
import { ExceptionHandlerDecorator } from '../../decorators/exception-handler.decorator';
import {
  AddressEntity,
  FavoriteAddressEntity,
  PaginatedFavoriteAddresses,
} from './entity/address.entity';
import { IContextServer } from '../../common/graphql/graphql.module';
import { AddressInput } from './dto/address.input';
import { FavoriteAddressPricesInput } from './dto/favorite-address-prices.input';
import { UserService } from '../user/user.service';
import { PaginationInput } from '../../repositories/common/pagination/pagination.input';

@UseGuards(AuthGuard)
@Resolver()
export class AddressResolver {
  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService,
  ) {}

  @Query(() => PaginatedFavoriteAddresses)
  @ExceptionHandlerDecorator()
  async getFavorites(
    @Context() ctx: IContextServer,
    @Args('input') input: PaginationInput,
  ) {
    const data = await this.addressService.paginateFavorites(
      ctx.req.user.id,
      input.page,
      input.perPage,
    );

    console.log(data);

    return data;
  }

  @Mutation(() => AddressEntity)
  @ExceptionHandlerDecorator()
  async addAddressToFavorite(
    @Context() ctx: IContextServer,
    @Args('addressData') addressInput: AddressInput,
    @Args('pricesData') pricesInput: FavoriteAddressPricesInput,
  ) {
    const user = await this.userService.findOneById(ctx.req.user.id, {
      id: true,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const address = await this.addressService.createOrUpdate(addressInput);

    await this.addressService.addToFavorite(user, address, pricesInput);

    return address;
  }
}
