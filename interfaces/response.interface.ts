export interface Response<T> {
  code?: number;
  data?: T;
  message?: string;
  took?: number;
  total?: number;
}
