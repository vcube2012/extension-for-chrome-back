import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AddToFavoriteInput } from '@/src/app/modules/resources/address/inputs/add-to-favorite.input';
import { GetFavoritesInput } from '@/src/app/modules/resources/address/inputs/get-favorites.input';
import { RemoveFromFavoritesInput } from '@/src/app/modules/resources/address/inputs/remove-from-favorites.input';
import { FindOneFavoriteInput } from '@/src/app/modules/resources/address/inputs/find-one-favorite.input';
import { RequestedFieldsDecorator } from '@/src/app/decorators/requested-fields.decorator';
import { AuthGuard } from '@/src/app/modules/common/auth/guard/auth.guard';
import { ExceptionHandlerDecorator } from '@/src/app/decorators/exception-handler.decorator';
import { IContextServer } from '@/src/app/modules/common/graphql/graphql.module';
import {
  FavoriteAddressEntity,
  PaginatedFavoriteAddresses,
} from '@/src/app/modules/resources/address/entity/favorite-address.entity';
import { AddressService } from '@/src/app/modules/resources/address/address.service';
import { Prisma } from '@prisma/client';
import { TagEntity } from '@/src/app/modules/resources/tag/entity/tag.entity';

@UseGuards(AuthGuard)
@Resolver(() => FavoriteAddressEntity)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Query(() => PaginatedFavoriteAddresses)
  @ExceptionHandlerDecorator()
  async getFavorites(
    @Context() ctx: IContextServer,
    @Args('input') input: GetFavoritesInput,
  ): Promise<PaginatedFavoriteAddresses> {
    return this.addressService.paginateFavorites(ctx.req.user.id, input);
  }

  @Query(() => FavoriteAddressEntity, { nullable: true })
  @ExceptionHandlerDecorator()
  async getOneFavorite(
    @Context() ctx: IContextServer,
    @Args('input') input: FindOneFavoriteInput,
    @RequestedFieldsDecorator({ exclude: ['tags', 'address'] })
    fields: Prisma.FavoriteAddressSelect,
  ): Promise<FavoriteAddressEntity | null> {
    return this.addressService.findOneFavoriteAddress(
      ctx.req.user.id,
      input.addressId,
      fields,
    );
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
