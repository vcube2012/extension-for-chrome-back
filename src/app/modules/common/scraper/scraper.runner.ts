import * as puppeteer from 'puppeteer';
import ScraperService from './scraper.service';
import { SeederInterface } from '@/prisma/seeds/seeders/interfaces/seeder.interface';
import MetropolitanSeeder from '@/prisma/seeds/seeders/metropolitan.seeder';
import { DatabaseService } from '@/src/app/modules/globals/database/database.service';
import StateSeeder from '@/prisma/seeds/seeders/state.seeder';
import CountySeeder from '@/prisma/seeds/seeders/county.seeder';
import ZipCodeSeeder from '@/prisma/seeds/seeders/zip-code.seeder';

export class ScraperRunner {
  private readonly db;

  constructor() {
    this.db = new DatabaseService();
  }

  async run() {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });
    const scraper = new ScraperService(browser);

    await this.callOne(new MetropolitanSeeder(scraper));
    await this.callOne(new StateSeeder(scraper));
    await this.callOne(new CountySeeder(scraper));
    await this.callOne(new ZipCodeSeeder(scraper));

    await browser.close();
  }

  async callOne(seeder: SeederInterface) {
    await seeder.run(this.db);
  }
}
