export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  meta?: {
    page?: number;
    limit?: number;
    total: number;
    totalPage: number;
  };
}


export interface IPagination {
      page?: number;
    limit?: number;
    total: number;
    totalPage: number;
}