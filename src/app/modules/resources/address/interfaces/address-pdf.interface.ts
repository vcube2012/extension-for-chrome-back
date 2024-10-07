export interface TemplateUrl {
  url: string | null;
  title: string;
}

export interface ScreenshotOptions {
  url: string;
  directory: string;
  extension: string;
  waitForSelector?: string | null;
}
