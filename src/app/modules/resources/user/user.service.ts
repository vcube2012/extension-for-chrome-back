import { DatabaseService } from '../../globals/database/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async findOneById(id: number, fields: Prisma.UserSelect) {
    const user = await this.db.user.findUniqueOrThrow({
      where: {
        id: id,
      },
      select: {
        ...fields,
        setting: {
          select: {
            data: true,
          },
        },
        _count: {
          select: {
            userPackages: true,
          },
        },
      },
    });

    return {
      ...user,
      can_activate_trial: user._count.userPackages <= 0,
    };
  }
}
