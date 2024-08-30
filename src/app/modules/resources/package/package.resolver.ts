import { Query, Resolver } from '@nestjs/graphql';
import { PackageEntity } from './entity/package.entity';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { RequestedFieldsDecorator } from '../../../decorators/requested-fields.decorator';
import { PackageService } from './package.service';
import { Prisma } from '@prisma/client';

@Resolver()
export class PackageResolver {
  constructor(private readonly packageService: PackageService) {}

  @Query(() => [PackageEntity])
  @ExceptionHandlerDecorator()
  async findAllPackages(
    @RequestedFieldsDecorator()
    fields: Prisma.PackageSelect,
  ) {
    return this.packageService.findAll(fields);
  }
}
