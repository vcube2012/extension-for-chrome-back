import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { SiteSettingRepoInterface } from '../../../../repositories/site-setting/site-setting-repo.interface';

export enum SiteSettingKey {
  VIDEO_MAIN_PAGE = 'video_main_page',
}

@ObjectType()
export class VideoMainPageEntity extends OmitType(
  SiteSettingRepoInterface,
  ['updated_at'],
  ObjectType,
) {
  @Field(() => String)
  value: any;
}
