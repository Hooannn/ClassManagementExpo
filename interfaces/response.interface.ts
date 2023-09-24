export interface Response<T> {
  code?: number;
  success?: boolean;
  data?: T;
  message?: string;
  took?: number;
  total?: number;
}
