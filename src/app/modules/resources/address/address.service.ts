import { DatabaseService } from '../../globals/database/database.service';
import { Injectable } from '@nestjs/common';
import { AddressEntity } from './entity/address.entity';
import { Prisma } from '@prisma/client';
import { PaginatedFavoriteAddresses } from './entity/favorite-address.entity';
import {
  AddressInput,
  AddToFavoriteInput,
} from './input/add-to-favorite.input';
import {
  GetFavoritesInput,
  GetFavoritesSorting,
  GetFavoritesSortingColumn,
} from './input/get-favorites.input';

@Injectable()
export class AddressService {
  constructor(private readonly db: DatabaseService) {}

  async paginateFavorites(
    userId: number,
    input: GetFavoritesInput,
  ): Promise<PaginatedFavoriteAddresses> {
    let wheres = {
      user_id: userId,
    };

    if (!!input.search?.length) {
      wheres = {
        ...wheres,
        ...{
          OR: [
            {
              address: {
                address: {
                  contains: input.search,
                },
              },
            },
            {
              tags: {
                some: {
                  tag: {
                    name: {
                      contains: input.search,
                    },
                  },
                },
              },
            },
          ],
        },
      };
    }

    const orderBy = this.makeOrderByConstraint(input.sorting);

    const paginatedRecords = await this.db.paginate({
      model: 'favoriteAddress',
      query: {
        where: {
          ...wheres,
        },
        include: {
          address: true,
          tags: {
            select: {
              tag: true,
            },
          },
        },
        orderBy: {
          ...orderBy,
        },
      },
      page: input.page,
      limit: input.perPage,
    });

    const data = this.transformEntity(paginatedRecords.data);

    return {
      data: data,
      meta: paginatedRecords.meta,
    } as PaginatedFavoriteAddresses;
  }

  async findOneFavoriteAddress(userId: number, addressId: number) {
    return this.db.favoriteAddress.findFirst({
      where: {
        user_id: userId,
        address_id: addressId,
      },
    });
  }

  async findOne(zipCodeId: number, address: string) {
    return this.db.address.findFirst({
      where: {
        zip_code_id: zipCodeId,
        address: address,
      },
    });
  }

  async addToFavorite(userId: number, input: AddToFavoriteInput) {
    const address = await this.createOrUpdate(input.address);

    const updatedUser = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        favoriteAddresses: {
          upsert: {
            where: {
              user_id_address_id: {
                user_id: userId,
                address_id: address.id,
              },
            },
            create: {
              address_id: address.id,
              info: input.prices as Prisma.JsonObject,
            },
            update: {
              address_id: address.id,
              info: input.prices as Prisma.JsonObject,
              updated_at: new Date(),
            },
          },
        },
      },
      include: {
        favoriteAddresses: {
          where: {
            user_id: userId,
            address_id: address.id,
          },
          include: {
            address: true,
          },
        },
      },
    });

    const [favoriteAddress] = updatedUser.favoriteAddresses;

    return favoriteAddress;
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
            zip_code_id: findZipCode.id,
            address: input.address,
            info: input.info,
            link: input.link,
          },
        });
      }

      return address;
    });
  }

  async removeFromFavorites(userId: number, addressId: number) {
    const favoriteAddress = await this.findOneFavoriteAddress(
      userId,
      addressId,
    );

    if (!favoriteAddress) return null;

    return this.deleteOneFavoriteAddress(userId, addressId);
  }

  async deleteOneFavoriteAddress(userId: number, addressId: number) {
    return this.db.$transaction(async () => {
      await this.db.tagFavoriteAddress.deleteMany({
        where: {
          user_id: userId,
          address_id: addressId,
        },
      });

      return this.db.favoriteAddress.delete({
        where: {
          user_id_address_id: {
            address_id: addressId,
            user_id: userId,
          },
        },
      });
    });
  }

  private transformEntity(favoriteAddresses) {
    const transformer = (favoriteAddress) => ({
      ...favoriteAddress,
      tags: favoriteAddress.tags.map(
        (tagFavoriteAddress) => tagFavoriteAddress.tag,
      ),
    });

    if (Array.isArray(favoriteAddresses)) {
      return favoriteAddresses.map((favoriteAddress) =>
        transformer(favoriteAddress),
      );
    }

    return transformer(favoriteAddresses);
  }

  private makeOrderByConstraint(input: GetFavoritesSorting) {
    switch (input.column) {
      case GetFavoritesSortingColumn.ADDRESS:
        return {
          address: {
            address: input.direction,
          },
        };
      // case GetFavoritesSortingColumn.ASKING:
      //   return {
      //     // info:
      //   };
      // case GetFavoritesSortingColumn.OFFER:
      //   console.log(GetFavoritesSortingColumn.OFFER);
      //   break;
      // case GetFavoritesSortingColumn.DOWN:
      //   console.log(GetFavoritesSortingColumn.DOWN);
      //   break;
      // case GetFavoritesSortingColumn.CASHFLOW:
      //   console.log(GetFavoritesSortingColumn.CASHFLOW);
      //   break;
      // case GetFavoritesSortingColumn.REPAIRS:
      //   console.log(GetFavoritesSortingColumn.REPAIRS);
      //   break;
      default:
        return {
          created_at: input.direction,
        };
    }
  }
}
