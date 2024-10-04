import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generatePDF(html: string, format: string = 'A4') {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.goto(`http://localhost:4000`);

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
            </head>
            <body>
              ${html}
            </body>
            </html>`,
    );

    const pdfConfig: puppeteer.PDFOptions = {
      omitBackground: true,
      printBackground: true,
      displayHeaderFooter: true,
      format: 'A4',
      landscape: false,
      preferCSSPageSize: false,
      tagged: false,
      path: 'test.pdf',
    };

    if (format !== 'A4') {
      delete pdfConfig.format;
      delete pdfConfig.landscape;
      delete pdfConfig.scale;
    }

    await page.pdf(pdfConfig);

    await browser.close();
  }
}
