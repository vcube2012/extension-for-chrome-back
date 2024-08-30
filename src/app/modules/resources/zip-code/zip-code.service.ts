import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ZipCodeHouseCodeInput,
  ZipCodesInput,
} from '@/src/app/modules/resources/zip-code/inputs/zip-codes.input';
import { Prisma } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ZipCodeEntity } from '@/src/app/modules/resources/zip-code/entity/zip-code.entity';
import { UserEntity } from '@/src/app/modules/resources/user/entity/user.entity';
import { DatabaseService } from '@/src/app/modules/globals/database/database.service';

@Injectable()
export class ZipCodeService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async findManyByCodes(
    input: ZipCodesInput,
    user: object,
    fields: Prisma.ZipCodeSelect,
  ): Promise<ZipCodeEntity[]> {
    const zipCodes = input.data.map(
      (item: ZipCodeHouseCodeInput) => item.zipCode,
    );

    const where: Prisma.ZipCodeWhereInput = {
      code: {
        in: zipCodes,
      },
    };

    if (!input.data?.length) {
      throw new BadRequestException('At least one zip code must be specified');
    }

    const results = await this.db.zipCode.findMany({
      where,
      select: { ...fields },
    });

    if (results.length > 0) {
      await this.calculateCredits(user, input.data);
    }

    return results;
  }

  // обрахування зняття кредитів з користувача
  private async calculateCredits(
    user: any,
    data: ZipCodeHouseCodeInput[],
  ): Promise<UserEntity> {
    const newItemsForUser = [];

    for (const item of data) {
      const alreadyCached = await this.cacheService.get(
        this.getCacheKey(user.id, item),
      );

      if (alreadyCached) {
        continue;
      }

      newItemsForUser.push(item);
    }

    if (newItemsForUser.length > 0 && user.credits <= 0) {
      throw new BadRequestException('Insufficient number of credits');
    }

    for (const item of newItemsForUser) {
      await this.cacheService.set(this.getCacheKey(user.id, item), 1, 0);
    }

    return this.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        credits: {
          decrement: newItemsForUser.length,
        },
      },
    });
  }

  private getCacheKey(userId: number, item: ZipCodeHouseCodeInput): string {
    return `${userId}_${item.houseCode}_${item.zipCode}`;
  }
}
