import { ISeeder } from './interfaces/ISeeder';
import { PrismaClient } from '@prisma/client';
import Scraper from '../../../scraper/scraper';
import * as puppeteer from 'puppeteer';

export class CountySeeder implements ISeeder {
  async run(prisma: PrismaClient) {
    const browser = await puppeteer.launch();
    const scraper = new Scraper(browser);
    const states = await prisma.state.findMany();

    for (const state of states) {
      const counties = await scraper.getCounties(state.code);

      for (const county of counties) {
        await prisma.state.update({
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
    }

    await browser.close();
  }
}
