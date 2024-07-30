import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { UpdateSettingInput } from './dto/update-setting.input';

@Injectable()
export class SettingService {
  constructor(private readonly db: DatabaseService) {}

  async updateSettings(input: UpdateSettingInput, userId: number) {
    return this.db.setting.upsert({
      where: {
        userId: userId,
      },
      create: {
        userId: userId,
        data: input.data,
      },
      update: {
        data: input.data,
      },
    });
  }
}
