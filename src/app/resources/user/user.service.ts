import { DatabaseService } from '../../globals/database/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async findOneById(id: number, fields: Prisma.UserSelect) {
    return this.db.user.findUniqueOrThrow({
      where: {
        id: id,
      },
      select: {
        ...fields,
      },
    });
  }
}
