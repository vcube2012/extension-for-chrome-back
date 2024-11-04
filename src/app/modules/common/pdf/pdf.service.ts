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

    await page.setContent(
      `<html lang="en" style="box-sizing: border-box; margin: 0; padding: 0">
            <head>
              <style>
                @media print {
                  .page {
                    page-break-before: always;
                    padding-left: 12px;
                    padding-right: 12px;
                  }
                  
                  .page:not(:first-child) {
                    padding-top: 24px;
                  }
                  
                  .page-title {
                    font-size: 24px;
                    font-weight: 700;
                  }
                  
                  .images {
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 10px;
                    margin-top: 20px;
                  }
                  
                  .images__item img {
                    width: 100%;
                    height: auto;
                    display: block;
                    object-fit: cover;
                  }
                }
              </style>
              ${!!options.styles ? options.styles : ''}
            </head>
            <body>             
              <main>
                ${!!options.content ? options.content : ''}
              </main>
              ${!!options.footerTemplate ? options.footerTemplate : ''}
            </body>
            </html>`,
    );

    const pdfConfig: puppeteer.PDFOptions = {
      printBackground: true,
      format: options.format,
      landscape: false,
      preferCSSPageSize: false,
      tagged: false,
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
