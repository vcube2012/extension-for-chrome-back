export const PER_PAGE = 10;

export interface PaginationOptions {
  model: string;
  query: object;
  page: number;
  limit?: number;
}

export interface WithPagination {
  paginate(options: PaginationOptions);
}
