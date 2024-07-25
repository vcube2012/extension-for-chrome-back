import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { UpdateSettingInput } from './dto/update-setting.input';

@Injectable()
export class SettingService {
  constructor(private readonly db: DatabaseService) {}

  async updateSettings(input: UpdateSettingInput, userId: number) {
    // return this.db.user.update({
    //   where: {
    //     id: userId,
    //   },
    //   data: {
    //     setting: {
    //       upsert: {
    //         where: {
    //           user_id: userId,
    //         },
    //         create: {
    //           user_id: userId,
    //           data: input.data,
    //         },
    //         update: {
    //           data: input.data,
    //           updated_at: new Date(),
    //         },
    //       },
    //     },
    //   },
    // });
  }
}
