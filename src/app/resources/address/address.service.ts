import { DatabaseService } from '../../globals/database/database.service';
import { Injectable } from '@nestjs/common';
import { AddressInput } from './dto/address.input';
import { AddressEntity } from './entity/address.entity';
import { FavoriteAddressPricesInput } from './dto/favorite-address-prices.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class AddressService {
  constructor(private readonly db: DatabaseService) {}

  async paginateFavorites(userId: number, page: number, perPage: number) {
    return await this.db.paginate({
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
      page: page,
      limit: perPage,
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
    pricesInput: FavoriteAddressPricesInput,
  ) {
    const info = pricesInput as Prisma.JsonObject;

    await this.db.user.update({
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
              info: info,
            },
            update: {
              addressId: address.id,
              info: info,
              updated_at: new Date(),
            },
          },
        },
      },
    });
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
