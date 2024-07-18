import { ISeeder } from './interfaces/ISeeder';
import ScraperService from '../../../src/app/common/scraper/./scraper.service';
import { DatabaseService } from '../../../src/app/globals/database/database.service';

export class CountySeeder implements ISeeder {
  constructor(private readonly scraperService: ScraperService) {}

  async run(db: DatabaseService) {
    const states = await db.state.findMany();

    for (const state of states) {
      const counties = await this.scraperService.getCounties(state.code);

      await db.$transaction(async () => {
        for (const county of counties) {
          await db.state.update({
            where: {
              id: state.id,
            },
            data: {
              counties: {
                upsert: {
                  where: {
                    code: county.code,
                  },
                  update: {
                    name: county.name,
                  },
                  create: {
                    code: county.code,
                    name: county.name,
                  },
                },
              },
            },
          });
        }
      });
    }
  }
}
