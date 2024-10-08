import { PaperFormat } from 'puppeteer';

export interface PdfOptions {
  content?: string;
  styles?: string;
  headerTemplate?: string;
  footerTemplate?: string;
  format?: PaperFormat;
}
