import * as puppeteer from 'puppeteer';
import ScraperService from './scraper.service';
import { DatabaseService } from '../../globals/database/database.service';
import MetropolitanSeeder from '../../../../../prisma/seeds/seeders/metropolitan.seeder';
import StateSeeder from '../../../../../prisma/seeds/seeders/state.seeder';
import CountySeeder from '../../../../../prisma/seeds/seeders/county.seeder';
import ZipCodeSeeder from '../../../../../prisma/seeds/seeders/zip-code.seeder';
import { SeederInterface } from '../../../../../prisma/seeds/seeders/interfaces/seeder.interface';

export class ScraperRunner {
  private readonly db;

  constructor() {
    this.db = new DatabaseService();
  }

  async run() {
    const callback = async (scraper: ScraperService) => {
      await this.callOne(new ZipCodeSeeder(scraper));
    };

    await this.runBrowser(callback);
  }

  async scrapeMetropolitans() {
    const callback = async (scraper: ScraperService) => {
      await this.callOne(new MetropolitanSeeder(scraper));
    };

    await this.runBrowser(callback);
  }

  async scrapeStatesAndMetropolitans() {
    const callback = async (scraper: ScraperService) => {
      await this.callOne(new StateSeeder(scraper));
      await this.callOne(new CountySeeder(scraper));
    };

    await this.runBrowser(callback);
  }

  async runForCounty(countyId: number) {
    const callback = async (scraper: ScraperService) => {
      const county = await this.db.county.findUnique({
        where: {
          id: Number(countyId),
        },
        include: {
          state: true,
        },
      });

      if (!county) {
        throw new Error(`Undefined county with id - ${countyId}`);
      }

      const zipCodes = await scraper.getZipCodesForCounty(
        county.state.code,
        county.code,
      );

      const zipCodeSeeder = new ZipCodeSeeder(scraper);

      await this.db.$transaction(
        async () => {
          const zipCodeIds = await zipCodeSeeder.getZipCodeIds(
            zipCodes,
            this.db,
          );

          for (const zipCodeId of zipCodeIds) {
            await this.db.zipCodesOnCounties.upsert({
              where: {
                zip_code_id_county_id: {
                  zip_code_id: zipCodeId,
                  county_id: county.id,
                },
              },
              update: {},
              create: {
                zip_code_id: zipCodeId,
                county_id: county.id,
              },
            });
          }
        },
        {
          timeout: 20000,
        },
      );
    };

    await this.runBrowser(callback);
  }

  async callOne(seeder: SeederInterface) {
    await seeder.run(this.db);
  }

  private async runBrowser(callback: (scraper: ScraperService) => any) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });

    const scraper = new ScraperService(browser);

    await callback(scraper);

    await browser.close();
  }
}
