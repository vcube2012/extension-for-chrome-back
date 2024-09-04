import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { ZipCodeService } from './zip-code.service';
import { ZipCodesInput } from '@/src/app/modules/resources/zip-code/inputs/zip-codes.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/src/app/modules/common/auth/guard/auth.guard';
import { ExceptionHandlerDecorator } from '@/src/app/decorators/exception-handler.decorator';
import { IContextServer } from '@/src/app/modules/common/graphql/graphql.module';
import { ZipCodesWithCredits } from '@/src/app/modules/resources/zip-code/entity/zip-code.entity';

@UseGuards(AuthGuard)
@Resolver()
export class ZipCodeResolver {
  constructor(private readonly zipCodeService: ZipCodeService) {}

  @Query(() => ZipCodesWithCredits)
  @ExceptionHandlerDecorator()
  async findManyZipCodes(
    @Args('input') input: ZipCodesInput,
    @Context() ctx: IContextServer,
  ): Promise<ZipCodesWithCredits> {
    return this.zipCodeService.findManyByCodes(input, ctx.req.user);
  }
}
