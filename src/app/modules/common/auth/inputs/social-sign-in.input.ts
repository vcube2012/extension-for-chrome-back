import { Field, InputType } from '@nestjs/graphql';
import { SocialAuthType } from '../../../../repositories/user/user-repo.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class SocialSignInInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  code: string;

  @Field(() => SocialAuthType, { defaultValue: SocialAuthType.GOOGLE })
  @IsString()
  @IsOptional()
  type?: SocialAuthType;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  referralToken?: string;
}
