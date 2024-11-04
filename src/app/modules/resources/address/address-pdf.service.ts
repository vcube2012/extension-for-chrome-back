import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PdfService } from '../../common/pdf/pdf.service';
import { AddressEntity } from './entity/address.entity';
import * as puppeteer from 'puppeteer';
import { DatabaseService } from '../../globals/database/database.service';
import { FavoriteAddressEntity } from './entity/favorite-address.entity';
import { Browser } from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  ScreenshotOptions,
  TemplateUrl,
} from './interfaces/address-pdf.interface';
import { PdfOptions } from '../../common/pdf/interface/pdf-options.interface';
import { isLogLevelEnabled } from '@nestjs/common/services/utils';

const baseScreenshotsPath = 'screenshots';

@Injectable()
export class AddressPdfService {
  constructor(
    private readonly db: DatabaseService,
    private readonly pdfService: PdfService,
  ) {}

  async makePdf(userId: number, addressId: number, options: PdfOptions) {
    const favoriteAddress = await this.findFavoriteAddress(userId, addressId);

    if (!favoriteAddress || !favoriteAddress?.address) {
      throw new InternalServerErrorException(
        'User does not have this address in favorites',
      );
    }

    const content = await this.makePdfContent(
      favoriteAddress?.address,
      userId,
      options.content,
    );

    const pdfOptions: PdfOptions = {
      ...options,
      content: content,
    };

    const pdfBuffer = await this.pdfService.generatePDF(pdfOptions);

    return JSON.stringify(pdfBuffer);
  }

  private async findFavoriteAddress(
    userId: number,
    addressId: number,
  ): Promise<FavoriteAddressEntity> {
    return this.db.favoriteAddress.findUnique({
      where: {
        user_id_address_id: {
          user_id: userId,
          address_id: addressId,
        },
      },
      include: {
        address: true,
      },
    });
  }

  // Create html content for html body
  private async makePdfContent(
    address: AddressEntity,
    userId: number,
    html: string,
  ) {
    // Output html content passed from client
    let content = `<div class="page">${html}</div>`;

    // Output house images
    if (Number(address.images?.length) > 0) {
      content += this.getImagesPdfContent(address.images);
    }

    return content;
  }

  private async getScreenshotsPdfContent(
    screenshotDir: string,
    items: TemplateUrl[],
  ) {
    let content = '<div class="page">';

    const screenshots = [];

    const fileExtension = 'jpg';
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Create directory if it does not exists
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Concat base64 images
    for (const item of items) {
      if (!!item.url) {
        const { base64String, fileName } =
          await this.getBase64StringFromScreenshot(browser, {
            templateUrl: item,
            directory: screenshotDir,
            extension: fileExtension,
            waitForSelector: item.selector,
          });

        if (!base64String || !fileName) {
          continue;
        }

        screenshots.push(fileName);

        content += `<h2>${item.title}</h2>`;
        content += `<img src="data:image/${fileExtension};base64,${base64String}" alt="${item.title}" width="90%"/>`;
      }
    }

    content += '</div>';

    await browser.close();

    // Delete saved screenshots
    if (screenshots.length > 0) {
      await this.deleteScreenshots(screenshotDir, screenshots);
    }

    return content;
  }

  private getImagesPdfContent(images: string[]): string {
    let imagesContent = '<div class="page">';
    imagesContent += '<span class="page-title">Photos</span>';
    imagesContent += '<div class="images">';

    images.map(
      (image) =>
        (imagesContent += `<div class="images__item"><img src="${image}"/></div>`),
    );

    imagesContent += '</div>';
    imagesContent += '</div>';

    return imagesContent;
  }

  private async deleteScreenshots(directory: string, screenshots: string[]) {
    for (const screenshot of screenshots) {
      const file = path.join(directory, screenshot);

      fs.unlink(file, (err) => {
        if (!!err) {
          console.log(`Cannot delete file: ${file}. Error: \n`);
          console.log(err);
        }
      });
    }
  }

  private async getBase64StringFromScreenshot(
    browser: Browser,
    options: ScreenshotOptions,
  ) {
    try {
      const page = await browser.newPage();

      if (options) await page.goto(options.templateUrl.url, { timeout: 10000 });

      const fileName = `${uuidv4()}.${options.extension}`;
      const screenshotPath = path.join(options.directory, fileName);

      const buffer = await page.screenshot({
        path: screenshotPath,
      });

      return {
        base64String: buffer.toString('base64'),
        fileName: fileName,
      };
    } catch (error) {
      console.log(error);
    }

    return {
      base64String: null,
      fileName: null,
    };
  }
}
