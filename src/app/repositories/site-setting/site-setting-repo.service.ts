import { Injectable } from '@nestjs/common';
import { SiteSettingKey } from '../../modules/resources/site-setting/entity/site-setting.entity';
import { DatabaseService } from '../../modules/globals/database/database.service';

@Injectable()
export class SiteSettingRepoService {
  constructor(private readonly db: DatabaseService) {}

  async findOne(key: SiteSettingKey) {
    const data = await this.db.siteSetting.findUnique({
      where: {
        key: key,
      },
    });

    if (!!data) {
      let value = null;

      if (data.key === SiteSettingKey.SOCIAL_MEDIA) {
        const arr: any = data.value ?? [];

        value = arr.map((item) => item?.data);
      } else {
        value = data.value[0]?.data?.value;
      }

      return {
        ...data,
        value: value,
      };
    }

    return null;
  }
}
