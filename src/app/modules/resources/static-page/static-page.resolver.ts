import { Query, Resolver } from '@nestjs/graphql';
import { StaticPageEntity } from './entity/static-page.entity';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { RequestedFieldsDecorator } from '../../../decorators/requested-fields.decorator';
import { Prisma } from '@prisma/client';
import { StaticPageService } from './static-page.service';

@Resolver()
export class StaticPageResolver {
  constructor(private readonly staticPageService: StaticPageService) {}

  @Query(() => [StaticPageEntity])
  @ExceptionHandlerDecorator()
  async findAllStaticPages(
    @RequestedFieldsDecorator() fields: Prisma.StaticPageSelect,
  ) {
    return this.staticPageService.findAll(fields);
  }
}
