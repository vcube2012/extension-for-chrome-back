import { ISeeder } from './interfaces/ISeeder';
import ScraperService from '../../../src/app/common/scraper/./scraper.service';
import * as puppeteer from 'puppeteer';
import { DatabaseService } from '../../../src/app/common/database/database.service';

export class MetropolitanSeeder implements ISeeder {
  async run(db: DatabaseService) {
    const browser = await puppeteer.launch();
    const scraper = new ScraperService(browser);

    const items = await scraper.getMetropolitans();

    db.$transaction(async () => {
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
    });

    await browser.close();
  }
}
