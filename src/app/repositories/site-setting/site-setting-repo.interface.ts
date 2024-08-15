import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class SiteSettingRepoInterface {
  @Field()
  key: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
