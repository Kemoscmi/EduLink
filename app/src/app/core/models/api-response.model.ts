export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export type ApiListResponse<T> = T[];

export interface PaginatedData<T> {
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: T[];
}

export type ApiPaginatedResponse<T> = ApiResponse<PaginatedData<T>>;