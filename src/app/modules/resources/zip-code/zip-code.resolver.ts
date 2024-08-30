import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { ZipCodeService } from './zip-code.service';
import { ZipCodeEntity } from './entity/zip-code.entity';
import { ZipCodesInput } from '@/src/app/modules/resources/zip-code/inputs/zip-codes.input';
import { Prisma } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/src/app/modules/common/auth/guard/auth.guard';
import { ExceptionHandlerDecorator } from '@/src/app/decorators/exception-handler.decorator';
import { IContextServer } from '@/src/app/modules/common/graphql/graphql.module';
import { RequestedFieldsDecorator } from '@/src/app/decorators/requested-fields.decorator';

@UseGuards(AuthGuard)
@Resolver()
export class ZipCodeResolver {
  constructor(private readonly zipCodeService: ZipCodeService) {}

  @Query(() => [ZipCodeEntity])
  @ExceptionHandlerDecorator()
  async findManyZipCodes(
    @Args('input') input: ZipCodesInput,
    @Context() ctx: IContextServer,
    @RequestedFieldsDecorator() fields: Prisma.ZipCodeSelect,
  ) {
    return this.zipCodeService.findManyByCodes(input, ctx.req.user, fields);
  }
}
