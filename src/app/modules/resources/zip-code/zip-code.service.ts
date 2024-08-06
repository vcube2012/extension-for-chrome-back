import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { ZipCodeInput } from './input/zip-code.input';
import { ZipCodesInput } from './input/zip-codes.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class ZipCodeService {
  constructor(private readonly db: DatabaseService) {}

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

  async findManyByCodes(input: ZipCodesInput, fields: Prisma.ZipCodeSelect) {
    const where: Prisma.ZipCodeWhereInput = {
      code: {
        in: input.codes,
      },
    };

    if (!input.codes?.length) {
      throw new BadRequestException('At least one zip code must be specified');
    }

    return this.db.zipCode.findMany({
      where,
      select: { ...fields },
    });
  }
}
