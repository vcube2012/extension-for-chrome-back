import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PdfOptions } from './interface/pdf-options.interface';

@Injectable()
export class PdfService {
  async generatePDF(options: PdfOptions) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.goto(process.env.WEBSITE_URL);

    await page.setContent(
      `<html lang="en" style="box-sizing: border-box; margin: 0; padding: 0">
            <head>
              <style>
                @media print {
                  .page {
                    page-break-before: always;
                  }
                }
              </style>
              ${!!options.styles ? options.styles : ''}
            </head>
            <body>             
              <main style="padding: 0 20px">
                ${!!options.content ? options.content : ''}
              </main>
              ${!!options.footerTemplate ? options.footerTemplate : ''}
            </body>
            </html>`,
    );

    const pdfConfig: puppeteer.PDFOptions = {
      printBackground: true,
      displayHeaderFooter: true,
      format: options.format,
      landscape: false,
      preferCSSPageSize: false,
      tagged: false,
      // path: 'test.pdf',
      headerTemplate: options.headerTemplate,
    };

    if (options.format !== 'A4') {
      delete pdfConfig.format;
      delete pdfConfig.landscape;
    }

    const buffer = await page.pdf(pdfConfig);

    await browser.close();

    return Buffer.from(buffer);
  }
}
