import { SeederInterface } from './interfaces/seeder.interface';
import ScraperService from '../../../src/app/common/scraper/./scraper.service';
import { DatabaseService } from '../../../src/app/globals/database/database.service';

export class ZipCodeSeeder implements SeederInterface {
  constructor(private readonly scraperService: ScraperService) {}

  async run(db: DatabaseService) {
    const metropolitans = await db.metropolitan.findMany();

    for (const metro of metropolitans) {
      const zipCodes = await this.scraperService.getZipCodesForMetropolitan(
        metro.code,
      );

      await db.$transaction(async () => {
        const zipCodeIds = await this.getZipCodeIdsForConnect(zipCodes, db);

        await db.metropolitan.update({
          where: {
            id: metro.id,
          },
          data: {
            zipCodes: {
              create: zipCodeIds,
            },
          },
        });
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
        const zipCodeIds = await this.getZipCodeIdsForConnect(zipCodes, db);

        await db.county.update({
          where: {
            id: county.id,
          },
          data: {
            zipCodes: {
              create: zipCodeIds,
            },
          },
        });
      });
    }
  }

  async getZipCodeIdsForConnect(
    zipCodes: { code: string; price: number }[],
    db: DatabaseService,
  ) {
    const data = [];

    for (const zipCode of zipCodes) {
      const zipCodeRecord = await this.createZipCode(zipCode, db);

      data.push({
        zipCode: {
          connect: {
            id: zipCodeRecord.id,
          },
        },
      });
    }

    return data;
  }

  async createZipCode(zipCode: { code; price }, db: DatabaseService) {
    return db.zipCode.upsert({
      where: {
        code: zipCode.code,
      },
      update: {
        price: zipCode.price,
      },
      create: {
        code: zipCode.code,
        price: zipCode.price,
      },
    });
  }
}
