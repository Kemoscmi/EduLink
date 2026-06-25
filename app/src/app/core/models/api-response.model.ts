export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export type ApiListResponse<T> = T[];