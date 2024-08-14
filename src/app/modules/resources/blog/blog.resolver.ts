import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { ExceptionHandlerDecorator } from '../../../decorators/exception-handler.decorator';
import { PaginateBlogsInput } from './input/paginate-blogs.input';
import { FindBlogInput } from './input/find-blog.input';
import { BlogEntity, PaginatedBlogs } from './entity/blog.entity';

@Resolver()
export class BlogResolver {
  constructor(private readonly blogService: BlogService) {}

  @Query(() => PaginatedBlogs)
  @ExceptionHandlerDecorator()
  async getBlogs(@Args('input') input: PaginateBlogsInput) {
    return this.blogService.paginateBlogs(input.page, input.perPage);
  }

  @Query(() => BlogEntity, { nullable: true })
  @ExceptionHandlerDecorator()
  async findBlog(@Args('input') input: FindBlogInput) {
    const blog = await this.blogService.findOneBySlug(input.slug);

    if (!!blog) {
      const viewsCount = await this.blogService.viewBlog(blog.id);

      blog.views = viewsCount ?? 0;
    }

    return blog;
  }

  @Mutation(() => Int, { nullable: true })
  @ExceptionHandlerDecorator()
  async likeBlog(@Args('input') input: FindBlogInput) {
    return this.blogService.likeBlog(input.slug);
  }
}
