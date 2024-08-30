import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { ZipCodeService } from './zip-code.service';
import { ZipCodeEntity } from './entity/zip-code.entity';
import { ZipCodeInput } from '@/src/app/modules/resources/zip-code/inputs/zip-code.input';
import { ZipCodesInput } from '@/src/app/modules/resources/zip-code/inputs/zip-codes.input';
import { RequestedFieldsDecorator } from '../../../decorators/requested-fields.decorator';
import { Prisma } from '@prisma/client';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { IContextServer } from '../../common/graphql/graphql.module';

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

  @Query(() => ZipCodeEntity, { nullable: true })
  @ExceptionHandlerDecorator()
  async findOneZipCode(
    @Args('input') input: ZipCodeInput,
    @RequestedFieldsDecorator() fields: Prisma.ZipCodeSelect,
  ) {
    return this.zipCodeService.findOneByCode(input, fields);
  }
}
