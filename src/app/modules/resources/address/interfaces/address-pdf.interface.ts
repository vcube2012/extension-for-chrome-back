export interface TemplateUrl {
  url: string | null;
  title: string;
  selector: string;
}

export interface ScreenshotClip {
  x: number;
  y: number;
}

export interface ScreenshotOptions {
  templateUrl: TemplateUrl;
  directory: string;
  extension: string;
  waitForSelector?: string | null;
}
