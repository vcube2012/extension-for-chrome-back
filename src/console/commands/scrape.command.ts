import { Command, CommandRunner, Option } from 'nest-commander';
import { ScraperRunner } from '../../app/modules/common/scraper/scraper.runner';

@Command({
  name: 'scrape',
  description: 'Web-scraping ',
  arguments: '[--county]',
})
export class ScrapeCommand extends CommandRunner {
  async run(passedParams: string[], options?: Record<string, any>) {
    console.log('Web-scraping starting...', '\n');

    try {
      if (!!options.county) {
        await new ScraperRunner().runForCounty(options.county);
      } else {
        await new ScraperRunner().run();
      }
    } catch (error) {
      console.error(error);
      return;
    }

    console.log('\n');
    console.log('Web-scraping finished successfully.');
  }

  @Option({
    flags: '--county [county]',
    description: 'Web-scraping for passed county',
  })
  countyId(countyId: number) {
    return countyId;
  }
}
