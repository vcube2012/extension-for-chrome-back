import { DatabaseService } from '../../globals/database/database.service';
import { DepositEntity } from '../../resources/deposit/entity/deposit.entity';
import { DepositStatus } from '../../../repositories/deposit/deposit-repo.interface';
import {
  PackageEntity,
  PackageUserEntity,
} from '../../resources/package/entity/package.entity';
import { UserEntity } from '../../resources/user/entity/user.entity';
import * as moment from 'moment';
import { PackageType } from '../../../repositories/package/package-repo.interface';

export abstract class PaymentDriver {
  protected constructor(protected readonly db: DatabaseService) {}

  async depositSuccess(deposit: DepositEntity): Promise<DepositEntity> {
    const updatedDeposit: DepositEntity = await this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        status: DepositStatus.SUCCESS,
      },
      include: {
        package: true,
        user: true,
      },
    });

    await this.setNewPackageForUser(deposit.package, deposit.user);

    return updatedDeposit;
  }

  async depositWaiting(
    deposit: DepositEntity,
    paymentId: string | null = null,
  ): Promise<DepositEntity> {
    return this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        status: DepositStatus.WAITING,
        payment_id: paymentId,
      },
    });
  }

  async depositFailed(
    deposit: DepositEntity,
    error: string | null = null,
  ): Promise<DepositEntity> {
    return this.db.deposit.update({
      where: {
        id: deposit.id,
      },
      data: {
        status: DepositStatus.WAITING,
        error: error,
      },
    });
  }

  private async setNewPackageForUser(
    subscribePlan: PackageEntity,
    user: UserEntity,
  ) {
    return this.db.$transaction(async (tx) => {
      const packageUser: PackageUserEntity = await tx.packageUser.create({
        data: {
          user_id: user.id,
          package_id: subscribePlan.id,
          is_active: true,
          credits: subscribePlan.credits,
        },
      });

      await tx.packageUser.updateMany({
        where: {
          id: {
            not: packageUser.id,
          },
        },
        data: {
          is_active: false,
        },
      });

      let date = user.package_available_to;

      if (!!date) {
        if (subscribePlan.type === PackageType.MONTHLY) {
          date = moment(date).add(1, 'month').toDate();
        } else {
          date = moment(date).add(1, 'year').toDate();
        }
      } else {
        if (subscribePlan.type === PackageType.MONTHLY) {
          date = moment().add(1, 'month').toDate();
        } else {
          date = moment().add(1, 'year').toDate();
        }
      }

      return tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          credits: {
            increment: subscribePlan.credits,
          },
          package_available_to: date,
        },
      });
    });
  }
}