import { ISeeder } from './interfaces/ISeeder';
import { PrismaClient } from '@prisma/client';
import Scraper from '../../../scraper/scraper';
import * as puppeteer from 'puppeteer';

export class ZipCodeSeeder implements ISeeder {
  async run(prisma: PrismaClient) {
    const browser = await puppeteer.launch();
    const scraper = new Scraper(browser);
    const metropolitans = await prisma.metropolitan.findMany();

    for (const metro of metropolitans) {
      const zipCodes = await scraper.getZipCodesForMetropolitan(metro.code);

      for (const zipCode of zipCodes) {
        await prisma.metropolitan.update({
          where: {
            id: metro.id,
          },
          data: {
            zipCodes: {
              connectOrCreate: {
                where: {
                  code: zipCode.code,
                },
                create: {
                  code: zipCode.code,
                  prices: zipCode.prices,
                },
              },
            },
          },
        });
      }
    }

    const counties = await prisma.county.findMany({
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
        await prisma.county.update({
          where: {
            id: county.id,
          },
          data: {
            zipCodes: {
              connectOrCreate: {
                where: {
                  code: zipCode.code,
                },
                create: {
                  code: zipCode.code,
                  prices: zipCode.prices,
                },
              },
            },
          },
        });
      }
    }

    await browser.close();
  }
}
