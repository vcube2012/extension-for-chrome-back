import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PackageEntity } from './entity/package.entity';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { RequestedFieldsDecorator } from '../../../decorators/requested-fields.decorator';
import { PackageService } from './package.service';
import { Prisma } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/guard/auth.guard';
import { BuyFreePackageInput } from './inputs/buy-free-package.input';
import { IContextServer } from '../../common/graphql/graphql.module';

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

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  @ExceptionHandlerDecorator()
  async buyFreePackage(
    @Context() ctx: IContextServer,
    @Args('input') input: BuyFreePackageInput,
  ) {
    return this.packageService.buyFree(ctx.req.user.id, input.package_id);
  }
}
