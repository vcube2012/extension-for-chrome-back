import { ISeeder } from './interfaces/ISeeder';
import ScraperService from '../../../src/app/common/scraper/./scraper.service';
import * as puppeteer from 'puppeteer';
import { DatabaseService } from '../../../src/app/common/database/database.service';

export class CountySeeder implements ISeeder {
  async run(db: DatabaseService) {
    const browser = await puppeteer.launch();
    const scraper = new ScraperService(browser);
    const states = await db.state.findMany();

    for (const state of states) {
      const counties = await scraper.getCounties(state.code);

      db.$transaction(async () => {
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

    await browser.close();
  }
}
