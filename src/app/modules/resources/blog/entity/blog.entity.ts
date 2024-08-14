import { ObjectType, OmitType } from '@nestjs/graphql';
import { BlogRepoInterface } from '../../../../repositories/blog/blog-repo.interface';
import { Paginated } from '../../../../repositories/common/pagination/pagination.entity';

@ObjectType()
export class BlogEntity extends OmitType(
  BlogRepoInterface,
  ['updated_at'],
  ObjectType,
) {}

@ObjectType()
export class PaginatedBlogs extends Paginated(BlogEntity) {}
