import { ISeeder } from './interfaces/ISeeder';
import ScraperService from '../../../src/app/common/scraper/./scraper.service';
import { DatabaseService } from '../../../src/app/globals/database/database.service';

export class ZipCodeSeeder implements ISeeder {
  constructor(private readonly scraperService: ScraperService) {}

  async run(db: DatabaseService) {
    const metropolitans = await db.metropolitan.findMany();

    for (const metro of metropolitans) {
      const zipCodes = await this.scraperService.getZipCodesForMetropolitan(
        metro.code,
      );

      await db.$transaction(async () => {
        for (const zipCode of zipCodes) {
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
        }
      });
    }

    const counties = await db.county.findMany({
      include: {
        state: true,
      },
    });

    for (const county of counties) {
      const zipCodes = await this.scraperService.getZipCodesForCounty(
        county.state.code,
        county.code,
      );

      await db.$transaction(async () => {
        for (const zipCode of zipCodes) {
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
        }
      });
    }
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
