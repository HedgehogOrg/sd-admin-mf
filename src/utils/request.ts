import { request as fetch } from 'Remote/Router';

export type RequestOptions = {
  url: string;
  method?: string;
  data?: { [key: string]: any };
  version?: string;
  showErrorMessage?: boolean;
};
const request = <Response = any>(options: RequestOptions): Promise<Response> => fetch<Response>(options);

export default request;
