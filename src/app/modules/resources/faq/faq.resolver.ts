import { Query, Resolver } from '@nestjs/graphql';
import { FaqService } from './faq.service';
import { RequestedFieldsDecorator } from '../../../decorators/requested-fields.decorator';
import { FaqEntity } from './entity/faq.entity';
import { Prisma } from '@prisma/client';

@Resolver()
export class FaqResolver {
  constructor(private readonly faqService: FaqService) {}

  @Query(() => [FaqEntity])
  async getFaq(@RequestedFieldsDecorator() fields: Prisma.FaqSelect) {
    return this.faqService.findAll(fields);
  }
}
