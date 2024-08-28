import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/src/app/modules/globals/database/database.service';
import {
  PackageEntity,
  PackageUserEntity,
} from '@/src/app/modules/resources/package/entity/package.entity';

@Injectable()
export class UserRepoService {
  constructor(private readonly db: DatabaseService) {}

  async findCurrentPackage(userId: number): Promise<PackageEntity> {
    const userPackage: PackageUserEntity = await this.db.packageUser.findFirst({
      where: {
        is_active: true,
        user_id: userId,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        package: true,
      },
    });

    return userPackage?.package;
  }
}
