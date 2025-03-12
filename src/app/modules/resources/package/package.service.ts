import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { Prisma } from '@prisma/client';
import { PackageEntity } from './entity/package.entity';
import { UserPackageService } from '../../../repositories/package/user-package.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PackageService {
  constructor(
    private readonly db: DatabaseService,
    private readonly userPackageService: UserPackageService,
  ) {}

  async findAll(fields: Prisma.PackageSelect) {
    return this.db.package.findMany({
      select: {
        ...fields,
      },
      where: {
        is_active: true,
      },
      orderBy: [
        {
          type: 'asc',
        },
        {
          sort_order: 'asc',
        },
      ],
    });
  }

  async buyFree(userId: number, packageId: number): Promise<string> {
    const packageEntity: PackageEntity = await this.db.package.findUnique({
      where: {
        id: packageId,
        is_active: true,
        is_trial: true,
      },
    });

    if (!packageEntity) {
      throw new BadRequestException('Undefined package');
    }

    await this.validateUserPackageHistory(userId);

    await this.userPackageService.setNewPackageForUser(
      packageEntity,
      userId,
      true,
    );

    return 'You are successfully subscribe to free plan';
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleUserCredits() {
    await this.db.$queryRaw`
      WITH users_with_free_packages AS (
        SELECT
          users.id as user_id,
          packages.credits,
          packages.type
            FROM users
            LEFT JOIN package_user
              ON users.id = package_user.user_id
              AND package_user.is_active = true
              AND package_user.is_trial = true
            INNER JOIN packages
              ON packages.id = package_user.package_id
              AND packages.is_active = true
              AND packages.is_trial = true
        )
        UPDATE users
        SET credits = users_with_free_packages.credits from users_with_free_packages
        WHERE id IN (SELECT user_id FROM users_with_free_packages)`;
  }

  private async validateUserPackageHistory(userId: number) {
    const userCurrentPackage = await this.db.packageUser.findFirst({
      where: {
        user_id: userId,
        is_active: true,
      },
    });

    if (userCurrentPackage?.is_trial) {
      throw new BadRequestException(
        'You have already subscribe to free package',
      );
    }

    if (userCurrentPackage?.is_active) {
      throw new BadRequestException('You have already subscribe to package');
    }

    const countOfPrevPackages = await this.db.packageUser.count({
      where: {
        user_id: userId,
      },
    });

    if (countOfPrevPackages > 0) {
      throw new BadRequestException('You have already had packages before');
    }
  }
}
