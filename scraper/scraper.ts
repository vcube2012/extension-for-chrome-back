import { Browser, Page } from 'puppeteer';
import { toSnakeCase } from '../helpers/helpers';

const metroSelector = '#metro_code';
const stateSelector = 'select[name="STATES"]';
const countySelector = '#countyselect';
const url =
  'https://www.huduser.gov/portal/datasets/fmr/fmrs/FY2024_code/select_Geography_sa.odn';

export default class Scraper {
  constructor(private browser: Browser) {}

  async getMetropolitans() {
    const page = await this.goToPage();
    const result = await this.getNamesWithCodes(page, metroSelector);

    await page.close();

    return result;
  }

  async getStates() {
    const page = await this.goToPage();
    const result = await this.getNamesWithCodes(page, stateSelector);

    await page.close();

    return result;
  }

  async getCounties(state: string) {
    const page = await this.goToPage();

    await page.locator(`option[value="${state}"]`).click();
    await page.waitForNavigation();

    const result = await this.getNamesWithCodes(page, countySelector);

    await page.close();

    return result;
  }

  async getZipCodesForCounty(stateCode: string, countyCode: string) {
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
  }

  async getZipCodesForMetropolitan(metroCode: string) {
    const page = await this.goToPage();

    await page.click(metroSelector);
    await page.select(metroSelector, metroCode);

    await page.locator('input[value="Select Metropolitan Area"]').click();
    await page.waitForNavigation();

    const result = await this.parseZipCodes(page);

    await page.close();

    return result;
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
      items.push(
        headings.reduce((obj, key, index) => {
          const snakeCaseKey = toSnakeCase(key);
          if (snakeCaseKey === 'zip_code') {
            obj[snakeCaseKey] = arr[index];
          } else {
            const cleanedValue = arr[index].replace(/[^0-9.-]+/g, '');
            obj[snakeCaseKey] = parseFloat(cleanedValue);
          }

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
