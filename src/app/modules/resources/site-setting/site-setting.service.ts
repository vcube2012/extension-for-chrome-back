import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { SiteSettingKey } from './entity/site-setting.entity';

@Injectable()
export class SiteSettingService {
  constructor(private readonly db: DatabaseService) {}

  async findOne(key: SiteSettingKey) {
    return this.db.siteSetting.findUnique({
      where: {
        key: key,
      },
    });
  }
}
