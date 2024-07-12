import { Browser, Page } from 'puppeteer';
import { toSnakeCase } from '../helpers/helpers';
import { Logger } from '@nestjs/common';

const metroSelector = '#metro_code';
const stateSelector = 'select[name="STATES"]';
const countySelector = '#countyselect';
const url =
  'https://www.huduser.gov/portal/datasets/fmr/fmrs/FY2024_code/select_Geography_sa.odn';

export default class Scraper {
  private logger;

  constructor(private browser: Browser) {
    this.logger = new Logger();
  }

  async getMetropolitans() {
    try {
      const page = await this.goToPage();
      const result = await this.getNamesWithCodes(page, metroSelector);

      await page.close();

      new Logger();

      return result;
    } catch (error) {
      this.logger.error(error);
    }

    return [];
  }

  async getStates() {
    try {
      const page = await this.goToPage();
      const result = await this.getNamesWithCodes(page, stateSelector);

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

      const result = await this.getNamesWithCodes(page, countySelector);

      await page.close();

      return result;
    } catch (error) {
      this.logger.error(error);
    }

    return [];
  }

  async getZipCodesForCounty(stateCode: string, countyCode: string) {
    try {
      const page = await this.goToPage();

      await page.locator(`option[value="${stateCode}"]`).click();
      await page.waitForNavigation();

      await page.click(countySelector);
      await page.select(countySelector, countyCode);

      await page.locator('input[value="Next Screen..."]').click();
      await page.waitForNavigation();

      const result = await this.parseZipCodes(page);

      await page.close();

      return result;
    } catch (error) {
      this.logger.error(error);
    }

    return [];
  }

  async getZipCodesForMetropolitan(metroCode: string) {
    try {
      const page = await this.goToPage();

      await page.click(metroSelector);
      await page.select(metroSelector, metroCode);

      await page.locator('input[value="Select Metropolitan Area"]').click();
      await page.waitForNavigation();

      const result = await this.parseZipCodes(page);

      await page.close();

      return result;
    } catch (error) {
      this.logger.error(error);
    }

    return [];
  }

  // Парсинг зіп-кодів з таблиці
  private async parseZipCodes(page: Page) {
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
          const snakeCaseKey = toSnakeCase(key);
          if (snakeCaseKey === 'zip_code') {
            obj['code'] = arr[index];
          } else {
            const cleanedValue = arr[index].replace(/[^0-9.-]+/g, '');
            prices[snakeCaseKey] = parseFloat(cleanedValue);
          }

          obj['prices'] = JSON.stringify(prices);

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

  // Перехід на базову сторінку
  private async goToPage() {
    const page = await this.browser.newPage();
    await page.goto(url);

    return page;
  }
}
