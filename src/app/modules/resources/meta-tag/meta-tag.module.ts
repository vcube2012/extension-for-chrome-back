import { Module } from '@nestjs/common';
import { MetaTagResolver } from './meta-tag.resolver';
import { MetaTagService } from './meta-tag.service';

@Module({
  providers: [MetaTagResolver, MetaTagService],
})
export class MetaTagModule {}
