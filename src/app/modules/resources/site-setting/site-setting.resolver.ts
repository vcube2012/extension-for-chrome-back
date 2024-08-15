import { Query, Resolver } from '@nestjs/graphql';
import { SiteSettingService } from './site-setting.service';
import {
  VideoMainPageEntity,
  SiteSettingKey,
} from './entity/site-setting.entity';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';

@Resolver()
export class SiteSettingResolver {
  constructor(private readonly siteSettingService: SiteSettingService) {}

  @Query(() => VideoMainPageEntity, { nullable: true })
  @ExceptionHandlerDecorator()
  async getMainPageVideo() {
    return this.siteSettingService.findOne(SiteSettingKey.VIDEO_MAIN_PAGE);
  }
}
