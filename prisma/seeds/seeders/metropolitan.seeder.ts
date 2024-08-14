import { SeederInterface } from './interfaces/seeder.interface';
import { DatabaseService } from '../../../src/app/modules/globals/database/database.service';
import ScraperService from '../../../src/app/modules/common/scraper/scraper.service';

export default class MetropolitanSeeder implements SeederInterface {
  constructor(private readonly scraperService: ScraperService) {}

  async run(db: DatabaseService) {
    const items = await this.scraperService.getMetropolitans();

    for (const item of items) {
      await db.metropolitan.upsert({
        where: {
          code: item.code,
        },
        update: {
          name: item.name,
        },
        create: {
          code: item.code,
          name: item.name,
        },
      });
    }
  }
}
