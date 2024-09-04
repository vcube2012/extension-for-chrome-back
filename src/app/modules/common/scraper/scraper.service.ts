import { Browser, Page } from 'puppeteer';
import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DomSelectorEnum } from './enums/dom-selector.enum';
import { ScraperRunner } from './scraper.runner';
import * as lodash from 'lodash';
import { sleep } from '../../../../helpers/helpers';

const url =
  'https://www.huduser.gov/portal/datasets/fmr/fmrs/FY2024_code/select_Geography_sa.odn';

export default class ScraperService {
  private logger;

  constructor(private browser: Browser) {
    this.logger = new Logger();
  }

  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  @Cron(CronExpression.EVERY_DAY_AT_6PM)
  async scrape() {
    await new ScraperRunner().run();
  }

  async getMetropolitans() {
    try {
      const page = await this.goToPage();
      const result = await this.getNamesWithCodes(page, DomSelectorEnum.metro);

      await sleep(1);

      await page.close();

      return result;
    } catch (error) {
      this.logger.error(error);
    }

    return [];
  }

  async getStates() {
    try {
      const page = await this.goToPage();
      const result = await this.getNamesWithCodes(page, DomSelectorEnum.state);

      await sleep(1);

      await page.close();

      return result;
    } catch (error) {
      this.logger.error(error);
    }

    return [];
  }

  async getCounties(state: string) {
    try {
      const page = await this.goToPage();

      await page.locator(`option[value="${state}"]`).click();
      await page.waitForNavigation();

      const result = await this.getNamesWithCodes(page, DomSelectorEnum.county);

      await sleep(1);

      await page.close();

      return result;
    } catch (error) {
      this.logger.error(error);
    }

    return [];
  }

  async getZipCodesForCounty(
    stateCode: string,
    countyCode: string,
  ): Promise<{ code: string; prices: object }[]> {
    try {
      const page = await this.goToPage();

      await page.locator(`option[value="${stateCode}"]`).click();
      await page.waitForNavigation();

      await page.click(DomSelectorEnum.county);
      await page.select(DomSelectorEnum.county, countyCode);

      await page.locator('input[value="Next Screen..."]').click();
      await page.waitForNavigation();

      const result = await this.parseZipCodes(page);

      await sleep(1);

      await page.close();

      return result;
    } catch (error) {
      this.logger.error(error);
    }

    return [];
  }

  async getZipCodesForMetropolitan(
    metroCode: string,
  ): Promise<{ code: string; prices: object }[]> {
    try {
      const page = await this.goToPage();

      await page.click(DomSelectorEnum.metro);
      await page.select(DomSelectorEnum.metro, metroCode);

      await page.locator('input[value="Select Metropolitan Area"]').click();
      await page.waitForNavigation();

      const result = await this.parseZipCodes(page);

      await sleep(1);

      await page.close();

      return result;
    } catch (error) {
      this.logger.error(error);
    }

    return [];
  }

  // Парсинг зіп-кодів з таблиці
  private async parseZipCodes(
    page: Page,
  ): Promise<{ code: string; prices: object }[]> {
    const headings = await page.$$eval('table > thead > tr', (elements) => {
      const arr = Array.from(elements).map((element) => {
        return Array.from(element.children).map((item) => item.textContent);
      });

      return arr[arr.length - 1];
    });

    const data = await page.$$eval('table > tbody > tr', (elements) => {
      return Array.from(elements).map((element) => {
        return Array.from(element.children).map((item) => item.textContent);
      });
    });

    const items = [];

    data.forEach((arr) => {
      const prices = {};
      items.push(
        headings.reduce((obj, key, index) => {
          const snakeCaseKey = lodash.snakeCase(key);

          if (snakeCaseKey === 'zip_code') {
            obj['code'] = arr[index];
          } else if (snakeCaseKey !== 'efficiency') {
            const cleanedValue = arr[index].replace(/[^0-9.-]+/g, '');
            prices[snakeCaseKey] = parseFloat(cleanedValue);
          }

          obj['prices'] = prices;

          return obj;
        }, {}),
      );
    });

    return items;
  }

  private async getNamesWithCodes(page: Page, selector: string) {
    return await page.$eval(selector, (element) => {
      return Array.from(element.children).map((item) => ({
        code: item.getAttribute('value'),
        name: item.textContent,
      }));
    });
  }

  // Перехід на сторінку
  private async goToPage() {
    const page = await this.browser.newPage();
    await page.goto(url);

    return page;
  }
}
