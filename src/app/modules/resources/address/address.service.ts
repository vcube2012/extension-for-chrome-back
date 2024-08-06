import { DatabaseService } from '../../globals/database/database.service';
import { Injectable } from '@nestjs/common';
import { AddressEntity } from './entity/address.entity';
import { Prisma } from '@prisma/client';
import { PaginatedFavoriteAddresses } from './entity/favorite-address.entity';
import {
  AddressInput,
  FavoriteAddressPricesInput,
} from './input/add-to-favorite.input';
import { GetFavoritesInput } from './input/get-favorites.input';

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
              tagFavoriteAddress: {
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

    const paginatedRecords = await this.db.paginate({
      model: 'favoriteAddress',
      query: {
        where: {
          ...wheres,
        },
        include: {
          address: true,
          tagFavoriteAddress: {
            select: {
              tag: true,
            },
          },
        },
        orderBy: {
          created_at: input.sorting,
        },
      },
      page: input.page,
      limit: input.perPage,
    });

    const data = paginatedRecords.data.map((favoriteAddress) => ({
      ...favoriteAddress,
      tags: favoriteAddress.tagFavoriteAddress.map(
        (tagFavoriteAddress) => tagFavoriteAddress.tag,
      ),
    }));

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
              user_id_address_id: {
                user_id: user.id,
                address_id: address.id,
              },
            },
            create: {
              address_id: address.id,
              info: prices as Prisma.JsonObject,
            },
            update: {
              address_id: address.id,
              info: prices as Prisma.JsonObject,
              updated_at: new Date(),
            },
          },
        },
      },
      include: {
        favoriteAddresses: {
          where: {
            user_id: user.id,
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
}
