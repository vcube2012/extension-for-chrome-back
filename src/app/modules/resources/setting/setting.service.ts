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
}
