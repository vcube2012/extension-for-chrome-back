import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import {
  FavoriteAddressEntity,
  PaginatedFavoriteAddresses,
} from './entity/favorite-address.entity';
import { AddressService } from './address.service';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { IContextServer } from '../../common/graphql/graphql.module';
import { GetFavoritesInput } from './inputs/get-favorites.input';
import { FindOneFavoriteInput } from './inputs/find-one-favorite.input';
import { RequestedFieldsDecorator } from '../../../decorators/requested-fields.decorator';
import { AddToFavoriteInput } from './inputs/add-to-favorite.input';
import { RemoveFromFavoritesInput } from './inputs/remove-from-favorites.input';
import { CreateFavoriteAddressPdfInput } from './inputs/create-favorite-address-pdf.input';
import { AddressPdfService } from './address-pdf.service';
import { PdfOptions } from '../../common/pdf/interface/pdf-options.interface';

@UseGuards(AuthGuard)
@Resolver(() => FavoriteAddressEntity)
export class AddressResolver {
  constructor(
    private readonly addressService: AddressService,
    private readonly pdfService: AddressPdfService,
  ) {}

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
    @RequestedFieldsDecorator({
      exclude: ['tags', 'address', 'user', 'fmr_info'],
    })
    fields: Prisma.FavoriteAddressSelect,
  ): Promise<FavoriteAddressEntity | null> {
    return this.addressService.findOneFavoriteAddress(
      ctx.req.user.id,
      input.homeCode,
      input.zipCode,
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

  @Mutation(() => Boolean)
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

  @Mutation(() => String)
  @ExceptionHandlerDecorator()
  async createPdf(
    @Context() ctx: IContextServer,
    @Args('input') input: CreateFavoriteAddressPdfInput,
  ) {
    const pdfOptions: PdfOptions = {
      format: 'A4',
      content: input.html,
      styles: input.styles,
    };

    ctx.res.header('Content-Type', 'application/pdf');

    return this.pdfService.makePdf(
      ctx.req.user.id,
      input.address_id,
      pdfOptions,
    );
  }
}
