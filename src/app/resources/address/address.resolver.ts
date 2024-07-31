import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { AddressService } from './address.service';
import { ExceptionHandlerDecorator } from '../../decorators/exception-handler.decorator';
import { AddressEntity } from './entity/address.entity';
import { IContextServer } from '../../common/graphql/graphql.module';
import { UserService } from '../user/user.service';
import {
  FavoriteAddressEntity,
  PaginatedFavoriteAddresses,
} from './entity/favorite-address.entity';
import { AddToFavoriteInput } from './dto/add-to-favorite.input';
import { GetFavoritesInput } from './dto/get-favorites.input';

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
    @Args('input') input: GetFavoritesInput,
  ) {
    return this.addressService.paginateFavorites(ctx.req.user.id, input);
  }

  @Mutation(() => FavoriteAddressEntity)
  @ExceptionHandlerDecorator()
  async addAddressToFavorite(
    @Context() ctx: IContextServer,
    @Args('input') input: AddToFavoriteInput,
  ) {
    const user = await this.userService.findOneById(ctx.req.user.id, {
      id: true,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const address = await this.addressService.createOrUpdate(input.address);

    return this.addressService.addToFavorite(user, address, input.prices);
  }
}
