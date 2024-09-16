import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SettingService } from './setting.service';
import { SettingEntity } from './entity/setting.entity';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { IContextServer } from '../../common/graphql/graphql.module';
import {
  UpdateFmrInput,
  UpdateSettingInput,
} from './inputs/update-setting.input';

@UseGuards(AuthGuard)
@Resolver()
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @Mutation(() => SettingEntity)
  @ExceptionHandlerDecorator()
  async updateSetting(
    @Context() ctx: IContextServer,
    @Args('input') input: UpdateSettingInput,
  ) {
    return this.settingService.updateSettings(input, ctx.req.user.id);
  }

  @Mutation(() => SettingEntity)
  @ExceptionHandlerDecorator()
  async updateFmr(
    @Context() ctx: IContextServer,
    @Args('input') input: UpdateFmrInput,
  ) {
    return this.settingService.updateFmr(input.fmr, ctx.req.user.id);
  }
}
