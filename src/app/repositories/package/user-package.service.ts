import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../modules/globals/database/database.service';
import { PackageEntity } from '../../modules/resources/package/entity/package.entity';
import { UserEntity } from '../../modules/resources/user/entity/user.entity';
import * as moment from 'moment/moment';
import { PackageType } from './package-repo.interface';

@Injectable()
export class UserPackageService {
  constructor(protected readonly db: DatabaseService) {}

  async setNewPackageForUser(
    subscribePlan: PackageEntity,
    userId: number,
    isTrial: boolean,
    deactivatePrev: boolean = true,
  ): Promise<UserEntity> {
    const date = this.getDateForSubscriptionPlan(subscribePlan.type);

    if (deactivatePrev) {
      await this.db.packageUser.updateMany({
        where: {
          user_id: userId,
        },
        data: {
          is_active: false,
        },
      });
    }

    // const userCredits = isTrial
    //   ? subscribePlan.trial_credits
    //   : subscribePlan.credits;

    await this.db.packageUser.create({
      data: {
        user_id: userId,
        package_id: subscribePlan.id,
        is_active: true,
        is_trial: isTrial,
        credits: subscribePlan.credits,
        price: subscribePlan.price,
        available_to: date,
        created_at: moment().toDate(),
      },
    });

    return this.earnCredits(userId, date, subscribePlan.credits);
  }

  async earnCredits(
    userId: number,
    date: Date,
    credits: number,
  ): Promise<UserEntity> {
    return this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {
          increment: credits,
        },
        package_available_to: date,
        unsubscribed: false,
      },
    });
  }

  getDateForSubscriptionPlan(period: string): Date {
    let date: any = moment();

    if (period === PackageType.MONTHLY) {
      date = date.add(1, 'month').toDate();
    } else {
      date = date.add(1, 'year').toDate();
    }

    return date;
  }
}
