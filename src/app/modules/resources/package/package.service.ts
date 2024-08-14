import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PackageService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(fields: Prisma.PackageSelect) {
    return this.db.package.findMany({
      select: {
        ...fields,
      },
    });
  }
}
