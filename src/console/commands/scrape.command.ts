import { Command, CommandRunner } from 'nest-commander';
import { ScraperRunner } from '../../app/modules/common/scraper/scraper.runner';

@Command({
  name: 'scrape',
  description: 'Web-scraping ',
})
export class ScrapeCommand extends CommandRunner {
  async run(passedParams: string[], options?: Record<string, any>) {
    console.log('Web-scraping starting...', '\n');

    try {
      await new ScraperRunner().run();
    } catch (error) {
      console.error(error);
      return;
    }

    console.log('\n');
    console.log('Web-scraping finished successfully.');
  }
}
