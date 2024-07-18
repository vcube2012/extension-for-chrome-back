import { ISeeder } from './interfaces/ISeeder';
import ScraperService from '../../../src/app/common/scraper/./scraper.service';
import * as puppeteer from 'puppeteer';
import { DatabaseService } from '../../../src/app/common/database/database.service';

export class ZipCodeSeeder implements ISeeder {
  async run(db: DatabaseService) {
    const browser = await puppeteer.launch();
    const scraper = new ScraperService(browser);
    const metropolitans = await db.metropolitan.findMany();

    for (const metro of metropolitans) {
      const zipCodes = await scraper.getZipCodesForMetropolitan(metro.code);

      for (const zipCode of zipCodes) {
        db.$transaction(async () => {
          const zipCodeRecord = await this.createZipCode(zipCode, db);

          await db.metropolitan.update({
            where: {
              id: metro.id,
            },
            data: {
              zipCodes: {
                connect: { id: zipCodeRecord.id },
              },
            },
          });
        });
      }
    }

    const counties = await db.county.findMany({
      include: {
        state: true,
      },
    });

    for (const county of counties) {
      const zipCodes = await scraper.getZipCodesForCounty(
        county.state.code,
        county.code,
      );

      for (const zipCode of zipCodes) {
        db.$transaction(async () => {
          const zipCodeRecord = await this.createZipCode(zipCode, db);

          await db.county.update({
            where: {
              id: county.id,
            },
            data: {
              zipCodes: {
                connect: { id: zipCodeRecord.id },
              },
            },
          });
        });
      }
    }

    await browser.close();
  }

  createZipCode(zipCode: { code; prices }, db: DatabaseService) {
    return db.zipCode.upsert({
      where: {
        code: zipCode.code,
      },
      update: {
        prices: zipCode.prices,
      },
      create: {
        code: zipCode.code,
        prices: zipCode.prices,
      },
    });
  }
}
