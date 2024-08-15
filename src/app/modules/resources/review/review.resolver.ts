import { Query, Resolver } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { RequestedFieldsDecorator } from '../../../decorators/requested-fields.decorator';
import { ReviewEntity } from './entity/review.entity';
import { Prisma } from '@prisma/client';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';

@Resolver()
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => [ReviewEntity])
  @ExceptionHandlerDecorator()
  async findReviews(@RequestedFieldsDecorator() fields: Prisma.FaqSelect) {
    return this.reviewService.findAll(fields);
  }
}
