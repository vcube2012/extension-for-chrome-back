import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { ZipCodeDto } from './dto/zip-code.dto';
import { ZipCodesDto } from './dto/zip-codes.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ZipCodeService {
  constructor(private readonly db: DatabaseService) {}

  async findOneByCode(dto: ZipCodeDto, fields: Prisma.ZipCodeSelect) {
    return this.db.zipCode.findUnique({
      where: {
        code: dto.code,
      },
      select: {
        ...fields,
        price: true,
      },
    });
  }

  async findManyByCodes(dto: ZipCodesDto, fields: Prisma.ZipCodeSelect) {
    const where: Prisma.ZipCodeWhereInput = {
      code: {
        in: dto.codes,
      },
    };

    if (!dto.codes?.length) {
      throw new BadRequestException('At least one zip code must be specified');
    }

    return this.db.zipCode.findMany({
      where,
      select: { ...fields, price: true },
    });
  }
}
