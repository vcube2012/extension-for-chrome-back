import { Field, InputType } from '@nestjs/graphql';
import { SocialAuthType } from '../../../../repositories/user/user-repo.interface';
import { IsOptional } from 'class-validator';

@InputType()
export class SocialSignInInput {
  @Field()
  code: string;

  @Field(() => SocialAuthType, { defaultValue: SocialAuthType.GOOGLE })
  @IsOptional()
  type?: SocialAuthType;
}
