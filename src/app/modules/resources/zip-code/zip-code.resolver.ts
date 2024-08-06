import { Resolver, Query, Args } from '@nestjs/graphql';
import { ZipCodeService } from './zip-code.service';
import { ZipCodeEntity } from './entity/zip-code.entity';
import { ZipCodeInput } from './input/zip-code.input';
import { ZipCodesInput } from './input/zip-codes.input';
import { RequestedFieldsDecorator } from '../../../decorators/requested-fields.decorator';
import { Prisma } from '@prisma/client';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Resolver()
export class ZipCodeResolver {
  constructor(private readonly zipCodeService: ZipCodeService) {}

  @Query(() => [ZipCodeEntity])
  @ExceptionHandlerDecorator()
  async findManyZipCodes(
    @Args('input') input: ZipCodesInput,
    @RequestedFieldsDecorator() fields: Prisma.ZipCodeSelect,
  ) {
    return this.zipCodeService.findManyByCodes(input, fields);
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
