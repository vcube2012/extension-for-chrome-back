import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { BlogEntity } from './entity/blog.entity';

@Injectable()
export class BlogService {
  constructor(private readonly db: DatabaseService) {}

  async paginateBlogs(page: number, perPage: number) {
    return await this.db.paginate({
      model: 'blog',
      query: {
        where: {
          is_active: true,
        },
      },
      page: page,
      limit: perPage,
    });
  }

  async findOneBySlug(slug: string) {
    return this.db.blog.findUnique({
      where: {
        slug: slug,
        is_active: true,
      },
    });
  }

  async likeBlog(slug: string) {
    let blog = await this.findOneBySlug(slug);

    if (!!blog) {
      blog = await this.db.blog.update({
        where: {
          slug: slug,
          is_active: true,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
    }

    return blog?.likes;
  }

  async viewBlog(id: number) {
    const blog = await this.db.blog.update({
      where: {
        id: id,
        is_active: true,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return blog?.views;
  }
}
