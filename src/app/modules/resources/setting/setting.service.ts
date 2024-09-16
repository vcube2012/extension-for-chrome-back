import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { UpdateSettingInput } from './inputs/update-setting.input';

@Injectable()
export class SettingService {
  constructor(private readonly db: DatabaseService) {}

  async updateSettings(input: UpdateSettingInput, userId: number) {
    return this.db.setting.upsert({
      where: {
        user_id: userId,
      },
      create: {
        user_id: userId,
        data: input.data,
      },
      update: {
        data: input.data,
      },
    });
  }

  async updateFmr(fmr: number, userId: number) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        setting: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const settingData = {
      fmr: fmr,
      use_loan: user.setting?.data['use_loan'] ?? false,
      purchase_range: {
        from: user.setting?.data['purchase_range']['from'] ?? null,
        to: user.setting?.data['purchase_range']['to'] ?? null,
      },
      mortgage: {
        down_payment: user.setting?.data['mortgage']['down_payment'] ?? null,
        interest_rate: user.setting?.data['mortgage']['interest_rate'] ?? null,
        loan_term: user.setting?.data['mortgage']['loan_term'] ?? null,
        closing_costs: user.setting?.data['mortgage']['closing_costs'] ?? null,
      },
      expenses: {
        property_taxes:
          user.setting?.data['expenses']['property_taxes'] ?? null,
        insurance: user.setting?.data['expenses']['insurance'] ?? null,
        hoa_fee: user.setting?.data['expenses']['hoa_fee'] ?? null,
        management: user.setting?.data['expenses']['management'] ?? null,
        maintenance: user.setting?.data['expenses']['maintenance'] ?? null,
        vacancy: user.setting?.data['expenses']['vacancy'] ?? null,
      },
    };

    return this.db.setting.upsert({
      where: {
        user_id: userId,
      },
      create: {
        user_id: userId,
        data: settingData,
      },
      update: {
        data: settingData,
      },
    });

    // return data;
  }
}
