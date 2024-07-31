import { DatabaseService } from '../../globals/database/database.service';
import { Injectable } from '@nestjs/common';
import { AddressEntity } from './entity/address.entity';
import { Prisma } from '@prisma/client';
import { PaginatedFavoriteAddresses } from './entity/favorite-address.entity';
import {
  AddressInput,
  FavoriteAddressPricesInput,
} from './dto/add-to-favorite.input';
import { GetFavoritesInput } from './dto/get-favorites.input';

@Injectable()
export class AddressService {
  constructor(private readonly db: DatabaseService) {}

  async paginateFavorites(
    userId: number,
    input: GetFavoritesInput,
  ): Promise<PaginatedFavoriteAddresses> {
    return this.db.paginate({
      model: 'favoriteAddress',
      query: {
        where: {
          userId: userId,
        },
        include: {
          address: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      },
      page: input.page,
      limit: input.perPage,
    });
  }

  async findOne(zipCodeId: number, address: string) {
    return this.db.address.findFirst({
      where: {
        zipCodeId: zipCodeId,
        address: address,
      },
    });
  }

  async addToFavorite(
    user,
    address: AddressEntity,
    prices: FavoriteAddressPricesInput,
  ) {
    const updatedUser = await this.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        favoriteAddresses: {
          upsert: {
            where: {
              userId_addressId: {
                userId: user.id,
                addressId: address.id,
              },
            },
            create: {
              addressId: address.id,
              info: prices as Prisma.JsonObject,
            },
            update: {
              addressId: address.id,
              info: prices as Prisma.JsonObject,
              updated_at: new Date(),
            },
          },
        },
      },
      include: {
        favoriteAddresses: {
          where: {
            userId: user.id,
            addressId: address.id,
          },
          include: {
            address: true,
          },
        },
      },
    });

    return updatedUser.favoriteAddresses[0];
  }

  async createOrUpdate(input: AddressInput): Promise<AddressEntity> {
    return this.db.$transaction(async () => {
      const findZipCode = await this.db.zipCode.findUniqueOrThrow({
        where: {
          code: input.zipCode,
        },
      });

      const findAddress = await this.findOne(findZipCode.id, input.address);

      let address;

      if (findAddress?.id) {
        address = await this.db.address.update({
          where: {
            id: findAddress.id,
          },
          data: {
            info: input.info,
            updated_at: new Date(),
          },
        });
      } else {
        address = await this.db.address.create({
          data: {
            zipCodeId: findZipCode.id,
            address: input.address,
            info: input.info,
          },
        });
      }

      return address;
    });
  }
}
