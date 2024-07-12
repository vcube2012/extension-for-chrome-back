import { ISeeder } from './interfaces/ISeeder';
import { PrismaClient } from '@prisma/client';
import Scraper from '../../../scraper/scraper';
import * as puppeteer from 'puppeteer';

export class MetropolitanSeeder implements ISeeder {
  async run(prisma: PrismaClient) {
    const browser = await puppeteer.launch();
    const scraper = new Scraper(browser);

    const items = await scraper.getMetropolitans();

    for (let item of items) {
        await prisma.metropolitan.upsert({
            where: {
                code: item.code
            },
            update: {
                name: item.name
            },
            create: {
                code: item.code,
                name: item.name
            }
        })
    }
    await browser.close()
  }
}
