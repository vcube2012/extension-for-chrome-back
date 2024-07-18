import { Resolver, Query, Args } from '@nestjs/graphql';
import { ZipCodeService } from './zip-code.service';
import { ZipCodeEntity } from './entity/zip-code.entity';
import { ZipCodeDto } from './dto/zip-code.dto';
import { ZipCodesDto } from './dto/zip-codes.dto';
import { RequestedFieldsDecorator } from '../../decorators/requested-fields.decorator';
import { Prisma } from '@prisma/client';
import { ExceptionHandlerDecorator } from '../../decorators/exception-handler.decorator';

// @ExceptionHandlerDecorator()
@Resolver()
export class ZipCodeResolver {
  constructor(private readonly zipCodeService: ZipCodeService) {}

  @Query(() => [ZipCodeEntity])
  findManyZipCodes(
    @Args('dto') dto: ZipCodesDto,
    @RequestedFieldsDecorator() fields: Prisma.ZipCodeSelect,
  ) {
    return this.zipCodeService.findManyByCodes(dto, fields);
  }

  @Query(() => ZipCodeEntity)
  findOneZipCode(
    @Args('dto') dto: ZipCodeDto,
    @RequestedFieldsDecorator() fields: Prisma.ZipCodeSelect,
  ) {
    return this.zipCodeService.findOneByCode(dto, fields);
  }
}
