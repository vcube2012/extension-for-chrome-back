import { SeederInterface } from './interfaces/seeder.interface';
import { DatabaseService } from '../../../src/app/modules/globals/database/database.service';
import ScraperService from '../../../src/app/modules/common/scraper/scraper.service';

export default class ZipCodeSeeder implements SeederInterface {
  constructor(private readonly scraperService: ScraperService) {}

  async run(db: DatabaseService) {
    const metropolitans = await db.metropolitan.findMany();

    for (const metro of metropolitans) {
      const zipCodes = await this.scraperService.getZipCodesForMetropolitan(
        metro.code,
      );

      await db.$transaction(async () => {
        const zipCodeIds = await this.getZipCodeIds(zipCodes, db);

        for (const zipCodeId of zipCodeIds) {
          await db.zipCodesOnMetropolitans.upsert({
            where: {
              zip_code_id_metropolitan_id: {
                zip_code_id: zipCodeId,
                metropolitan_id: metro.id,
              },
            },
            update: {},
            create: {
              zip_code_id: zipCodeId,
              metropolitan_id: metro.id,
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
        const zipCodeIds = await this.getZipCodeIds(zipCodes, db);

        for (const zipCodeId of zipCodeIds) {
          await db.zipCodesOnCounties.upsert({
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
      });
    }
  }

  async getZipCodeIds(
    zipCodes: { code: string; price: number }[],
    db: DatabaseService,
  ) {
    const data = [];

    for (const zipCode of zipCodes) {
      const zipCodeRecord = await this.createZipCode(zipCode, db);

      data.push(zipCodeRecord.id);
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
