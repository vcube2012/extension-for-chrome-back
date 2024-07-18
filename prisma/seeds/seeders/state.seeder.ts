import { ISeeder } from './interfaces/ISeeder';
import ScraperService from '../../../src/app/common/scraper/./scraper.service';
import { DatabaseService } from '../../../src/app/globals/database/database.service';

export class StateSeeder implements ISeeder {
  constructor(private readonly scraperService: ScraperService) {}

  async run(db: DatabaseService) {
    const items = await this.scraperService.getStates();

    for (const item of items) {
      await db.state.upsert({
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
