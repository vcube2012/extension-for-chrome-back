import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DatabaseService } from '../../globals/database/database.service';
import { ZipCodeHouseCodeInput, ZipCodesInput } from './inputs/zip-codes.input';
import { UserEntity } from '../user/entity/user.entity';
import { ZipCodesWithCredits } from './entity/zip-code.entity';

@Injectable()
export class ZipCodeService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async findManyByCodes(
    input: ZipCodesInput,
    user: UserEntity,
  ): Promise<ZipCodesWithCredits> {
    const zipCodes = input.data.map(
      (item: ZipCodeHouseCodeInput) => item.zipCode,
    );

    if (!input.data?.length) {
      throw new BadRequestException('At least one zip code must be specified');
    }

    const results = await this.db.zipCode.findMany({
      where: {
        code: {
          in: zipCodes,
        },
      },
    });

    let credits = user.credits;

    if (results.length > 0) {
      credits = await this.calculateCredits(user, input.data);
    }

    return {
      zipCodes: results,
      credits: credits,
    };
  }

  // обрахування зняття кредитів з користувача
  private async calculateCredits(
    user: UserEntity,
    data: ZipCodeHouseCodeInput[],
  ): Promise<number> {
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

    const updatedUser = await this.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        credits: {
          decrement: newItemsForUser.length,
        },
      },
    });

    return updatedUser.credits;
  }

  private getCacheKey(userId: number, item: ZipCodeHouseCodeInput): string {
    return `${userId}_${item.houseCode}_${item.zipCode}`;
  }
}
