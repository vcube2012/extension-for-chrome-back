import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { AddressService } from './address.service';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { IContextServer } from '../../common/graphql/graphql.module';
import { UserService } from '../user/user.service';
import {
  FavoriteAddressEntity,
  PaginatedFavoriteAddresses,
} from './entity/favorite-address.entity';
import { AddToFavoriteInput } from './input/add-to-favorite.input';
import { GetFavoritesInput } from './input/get-favorites.input';
import { RemoveFromFavoritesInput } from './input/remove-from-favorites.input';

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
    return this.addressService.addToFavorite(ctx.req.user.id, input);
  }

  @Mutation(() => FavoriteAddressEntity, { nullable: true })
  @ExceptionHandlerDecorator()
  async removeFromFavorites(
    @Context() ctx: IContextServer,
    @Args('input') input: RemoveFromFavoritesInput,
  ) {
    return this.addressService.removeFromFavorites(
      ctx.req.user.id,
      input.address_id,
    );
  }
}
