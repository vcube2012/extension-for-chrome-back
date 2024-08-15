import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';

enum LikeEnum {
  LIKE,
  UNLIKE,
}

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
    return this.likeOrUnlike(slug, LikeEnum.LIKE);
  }

  async unlikeBlog(slug: string) {
    return this.likeOrUnlike(slug, LikeEnum.UNLIKE);
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
