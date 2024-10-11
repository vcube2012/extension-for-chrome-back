import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { BlogEntity, PaginatedBlogs } from './entity/blog.entity';

enum LikeEnum {
  LIKE,
  UNLIKE,
}

@Injectable()
export class BlogService {
  private readonly db;

  constructor() {
    this.db = new DatabaseService().$extends({
      result: {
        blog: {
          image: {
            needs: { image: true },
            compute(blog) {
              return process.env.IMAGE_URL + 'blogs/' + blog.image;
            },
          },
        },
      },
    });
  }

  async paginateBlogs(page: number, perPage: number): Promise<PaginatedBlogs> {
    return this.db.paginate({
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

  async findOneBySlug(slug: string): Promise<BlogEntity> {
    return this.db.blog.findUnique({
      where: {
        slug: slug,
        is_active: true,
      },
    });
  }

  async likeBlog(slug: string) {
    return this.likeOrUnlike(slug, LikeEnum.LIKE);
  }

  async unlikeBlog(slug: string) {
    return this.likeOrUnlike(slug, LikeEnum.UNLIKE);
  }

  async viewBlog(id: number) {
    const blog: BlogEntity = await this.db.blog.update({
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

  private async likeOrUnlike(slug: string, type: LikeEnum) {
    let blog = await this.findOneBySlug(slug);

    const statement =
      type === LikeEnum.LIKE ? { increment: 1 } : { decrement: 1 };

    if (!!blog) {
      blog = await this.db.blog.update({
        where: {
          slug: slug,
          is_active: true,
        },
        data: {
          likes: {
            ...statement,
          },
        },
      });
    }

    return blog?.likes;
  }
}
