import { Injectable } from '@nestjs/common';
import { AddressEntity } from './entity/address.entity';
import {
  FavoriteAddressEntity,
  PaginatedFavoriteAddresses,
} from './entity/favorite-address.entity';
import {
  AddressInput,
  AddToFavoriteInput,
} from '@/src/app/modules/resources/address/inputs/add-to-favorite.input';
import {
  GetFavoritesInput,
  GetFavoritesSorting,
  GetFavoritesSortingColumn,
} from '@/src/app/modules/resources/address/inputs/get-favorites.input';
import { DatabaseService } from '@/src/app/modules/globals/database/database.service';
import { Prisma } from '@prisma/client';

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

    let orderBy = {};

    if (!!input?.sorting) {
      orderBy = this.makeOrderByConstraint(input.sorting);
    }

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

    const data = paginatedRecords.data.map((item: FavoriteAddressEntity) =>
      this.transformEntity(item),
    );

    return {
      data: data,
      meta: paginatedRecords.meta,
    } as PaginatedFavoriteAddresses;
  }

  async findOneFavoriteAddress(
    userId: number,
    homeCode: string,
    zipCode: string,
    fields: Prisma.FavoriteAddressSelect = null,
  ): Promise<FavoriteAddressEntity> {
    const query = {
      where: {
        user_id: userId,
        address: {
          home_code: homeCode,
          zipCode: {
            code: zipCode,
          },
        },
      },
    };

    if (!!fields) {
      query['select'] = {
        ...fields,
        address: true,
        tags: {
          select: {
            tag: true,
          },
        },
      };
    } else {
      query['include'] = {
        address: true,
        tags: {
          select: {
            tag: true,
          },
        },
      };
    }

    const favoriteAddress = await this.db.favoriteAddress.findFirst(query);

    if (!favoriteAddress) {
      return null;
    }

    return this.transformEntity(favoriteAddress);
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
              asking: input.prices.asking,
              down: input.prices.down,
              repairs: input.prices.repairs,
              cashflow: input.prices.cashflow,
              offer: input.prices.offer,
            },
            update: {
              address_id: address.id,
              asking: input.prices.asking,
              down: input.prices.down,
              repairs: input.prices.repairs,
              cashflow: input.prices.cashflow,
              offer: input.prices.offer,
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

    return this.transformEntity(favoriteAddress);
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
            home_code: input.homeCode,
            info: input.info,
            updated_at: new Date(),
          },
        });
      } else {
        address = await this.db.address.create({
          data: {
            home_code: input.homeCode,
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

  async removeFromFavorites(
    userId: number,
    addressId: number,
  ): Promise<boolean> {
    const favoriteAddress = await this.db.favoriteAddress.findFirst({
      where: {
        user_id: userId,
        address_id: addressId,
      },
    });

    if (!favoriteAddress) return false;

    return this.deleteOneFavoriteAddress(userId, addressId);
  }

  async deleteOneFavoriteAddress(
    userId: number,
    addressId: number,
  ): Promise<boolean> {
    const favoriteAddress = await this.db.$transaction(async () => {
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
        include: {
          address: true,
          tags: {
            select: {
              tag: true,
            },
          },
        },
      });
    });

    return !!favoriteAddress;
  }

  private transformEntity(favoriteAddresses: FavoriteAddressEntity) {
    const transformer = (favoriteAddress): FavoriteAddressEntity => ({
      ...favoriteAddress,
      tags:
        favoriteAddress.tags?.map(
          (tagFavoriteAddress) => tagFavoriteAddress.tag,
        ) ?? [],
    });

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
      case GetFavoritesSortingColumn.ASKING:
        return {
          asking: input.direction,
        };
      case GetFavoritesSortingColumn.OFFER:
        return {
          offer: input.direction,
        };
      case GetFavoritesSortingColumn.DOWN:
        return {
          down: input.direction,
        };
      case GetFavoritesSortingColumn.CASHFLOW:
        return {
          cashflow: input.direction,
        };
      case GetFavoritesSortingColumn.REPAIRS:
        return {
          repairs: input.direction,
        };
      default:
        return {
          created_at: input.direction,
        };
    }
  }
}
