import { Injectable } from '@nestjs/common';
import { SiteSettingKey } from '../../modules/resources/site-setting/entity/site-setting.entity';
import { DatabaseService } from '../../modules/globals/database/database.service';

@Injectable()
export class SiteSettingRepoService {
  constructor(private readonly db: DatabaseService) {}

  async findOne(key: SiteSettingKey) {
    return this.db.siteSetting.findUnique({
      where: {
        key: key,
      },
    });
  }
}
