export interface ResponseApi<T = never> {
  code: number;
  data: T;
  message: string;
  status: string;
  pagination?: PagingInfo;
}
interface PagingInfo {
  page: number;
  limit: number;
  total_pages: number;
  total_items: number;
}
