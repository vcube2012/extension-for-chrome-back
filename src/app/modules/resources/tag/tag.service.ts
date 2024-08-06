import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { SaveTagsInput } from './input/save-tags.input';
import { AddressService } from '../address/address.service';

@Injectable()
export class TagService {
  constructor(
    private readonly db: DatabaseService,
    private readonly addressService: AddressService,
  ) {}

  async saveTagsForFavoriteAddress(userId: number, input: SaveTagsInput) {
    const favoriteAddress = await this.addressService.findOneFavoriteAddress(
      userId,
      input.address_id,
    );

    if (!favoriteAddress) {
      throw new InternalServerErrorException(
        'User does not have this address in favorites',
      );
    }

    const tagRecords = await this.saveTags(input.tags);

    const tagFavoriteAddresses = tagRecords.map((tagRecord) => ({
      address_id: input.address_id,
      user_id: userId,
      tag_id: tagRecord.id,
    }));

    await this.db.$transaction([
      // Видаляємо старі зв'язки
      this.db.tagFavoriteAddress.deleteMany({
        where: {
          address_id: input.address_id,
          user_id: userId,
        },
      }),

      this.db.tagFavoriteAddress.createMany({
        data: tagFavoriteAddresses,
      }),
    ]);

    return tagRecords;
  }

  private async saveTags(tags: string[]) {
    const upsertData = tags.map((tag) => {
      return this.db.tag.upsert({
        where: {
          name: tag,
        },
        update: {},
        create: {
          name: tag,
        },
      });
    });

    return this.db.$transaction(upsertData);
  }
}
