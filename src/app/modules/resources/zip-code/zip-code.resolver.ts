import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { ZipCodeService } from './zip-code.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { ZipCodesWithCredits } from './entity/zip-code.entity';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { ZipCodesInput } from './inputs/zip-codes.input';
import { IContextServer } from '../../common/graphql/graphql.module';

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
