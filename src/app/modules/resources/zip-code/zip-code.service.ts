import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { ZipCodeInput } from './input/zip-code.input';
import { ZipCodesInput } from './input/zip-codes.input';
import { Prisma } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ZipCodeService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findOneByCode(input: ZipCodeInput, fields: Prisma.ZipCodeSelect) {
    return this.db.zipCode.findUnique({
      where: {
        code: input.code,
      },
      select: {
        ...fields,
      },
    });
  }

  async findManyByCodes(
    input: ZipCodesInput,
    user: object,
    fields: Prisma.ZipCodeSelect,
  ) {
    const where: Prisma.ZipCodeWhereInput = {
      code: {
        in: input.codes,
      },
    };

    if (!input.codes?.length) {
      throw new BadRequestException('At least one zip code must be specified');
    }

    const results = await this.db.zipCode.findMany({
      where,
      select: { ...fields },
    });

    if (results.length > 0) {
      await this.calculateCredits(user, results);
    }

    return results;
  }

  // обрахування зняття кредитів з користувача
  private async calculateCredits(user: any, zipCodes: any[]) {
    const newZipCodesForUser = [];

    for (const zipCode of zipCodes) {
      const alreadyCached = await this.cacheManager.get(
        this.getCacheKey(user.id, zipCode.code),
      );

      if (alreadyCached) {
        continue;
      }

      newZipCodesForUser.push(zipCode);
    }

    if (newZipCodesForUser.length > 0 && user.credits <= 0) {
      throw new BadRequestException('Insufficient number of credits');
    }

    for (const zipCode of newZipCodesForUser) {
      await this.cacheManager.set(
        this.getCacheKey(user.id, zipCode.code),
        1,
        0,
      );
    }

    return this.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        credits: {
          decrement: newZipCodesForUser.length,
        },
      },
    });
  }

  private getCacheKey(userId: number, zipCode: string): string {
    return `${userId}_${zipCode}`;
  }
}
