import { Module } from '@nestjs/common';
import { StaticPageService } from './static-page.service';
import { StaticPageResolver } from './static-page.resolver';

@Module({
  providers: [StaticPageService, StaticPageResolver],
})
export class StaticPageModule {}
