import axios from 'axios';
import {AxiosError} from 'axios';
import {NextApiResponse} from 'next';
import useSWR, {SWRResponse} from 'swr';

/*
 * Types.
 */

export type NetResponse<T> = NextApiResponse<
  | T
  | {
      error: string;
    }
>;

/*
 * Utilities.
 */

export async function netGet<T>(url: string): Promise<T> {
  const response = await axios.get<T>(url);
  return response.data;
}

export async function netPost<T, V>(url: string, body?: T): Promise<V> {
  const response = await axios.post<V>(url, body);
  return response.data;
}

/*
 * Hooks.
 */

export function useNetGet<T>(url: string): SWRResponse<T, AxiosError<Error>> {
  return useSWR<T, AxiosError<Error>>(url, netGet);
}
