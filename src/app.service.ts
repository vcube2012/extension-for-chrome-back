import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';

@Injectable()
export class AppService {
  @Cron(CronExpression.EVERY_HOUR)
  scrape() {
    exec('yarn run scrape');
  }
}
