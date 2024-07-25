import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UpdateSettingInput } from './dto/update-setting.input';
import { SettingService } from './setting.service';
import { SettingEntity } from './entity/setting.entity';
import { ExceptionHandlerDecorator } from '../../decorators/exception-handler.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { IContextServer } from '../../common/graphql/graphql.module';

@Resolver()
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => SettingEntity)
  @ExceptionHandlerDecorator()
  async updateSetting(
    @Context() ctx: IContextServer,
    @Args('input') input: UpdateSettingInput,
  ) {
    return this.settingService.updateSettings(input, ctx.req.user.id);
  }
}
