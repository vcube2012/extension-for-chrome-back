import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  PaginationOptions,
  WithPagination,
  PER_PAGE,
} from '../../../repositories/common/pagination/pagination.interface';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, WithPagination
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });

    // Adding BigInt serialization middleware
    this.$use(async (params, next) => {
      const result = await next(params);

      // Recursive function to serialize BigInt fields
      const serializeBigIntFields = (data: any): any => {
        if (data && typeof data === 'object') {
          for (const key in data) {
            if (typeof data[key] === 'bigint') {
              data[key] = Number(data[key].toString());
            } else if (typeof data[key] === 'object') {
              data[key] = serializeBigIntFields(data[key]);
            }
          }
        }
        return data;
      };

      return serializeBigIntFields(result);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async paginate(options: PaginationOptions) {
    const perPage = options.limit ?? PER_PAGE;
    const currentPage = options.page;

    if (!options.query) {
      options.query = {};
    }

    options.query['take'] = perPage;
    options.query['skip'] =
      currentPage > 1 ? (currentPage - 1) * options.query['take'] : 0;

    const modelQuery = this[options.model];
    const whereInput = options.query['where'] ?? null;

    const [data, total] = await Promise.all([
      modelQuery.findMany(options.query),
      whereInput ? modelQuery.count({ where: whereInput }) : modelQuery.count(),
    ]);

    const lastPage = Math.max(Math.ceil(total / perPage), 1);

    return {
      data: data,
      meta: {
        currentPage: currentPage,
        lastPage: lastPage,
        total: total,
        perPage: perPage,
        count: data.length,
        hasMorePages: currentPage < lastPage,
      },
    };
  }
}
