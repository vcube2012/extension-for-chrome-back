import { SeederInterface } from './interfaces/seeder.interface';
import { DatabaseService } from '../../../src/app/modules/globals/database/database.service';
import ScraperService from '../../../src/app/modules/common/scraper/scraper.service';

export class CountySeeder implements SeederInterface {
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
