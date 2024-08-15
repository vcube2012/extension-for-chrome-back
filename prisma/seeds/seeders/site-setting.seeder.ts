import { SeederInterface } from './interfaces/seeder.interface';
import { PrismaClient } from '@prisma/client';
import { SiteSettingKey } from '../../../src/app/modules/resources/site-setting/entity/site-setting.entity';

export default class SiteSettingSeeder implements SeederInterface {
  async run(prisma: PrismaClient) {
    await prisma.siteSetting.upsert({
      where: {
        key: SiteSettingKey.VIDEO_MAIN_PAGE,
      },
      update: {},
      create: {
        key: SiteSettingKey.VIDEO_MAIN_PAGE,
        value:
          'https://www.youtube.com/embed/gmr7sSF3VUo?si=gc2NtXbtfhbA6PQD?autoplay=1',
      },
    });

    await prisma.siteSetting.upsert({
      where: {
        key: SiteSettingKey.PARTNER_BONUS,
      },
      update: {},
      create: {
        key: SiteSettingKey.PARTNER_BONUS,
        value: 10,
      },
    });
  }
}
