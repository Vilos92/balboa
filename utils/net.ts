import axios from 'axios';
import {AxiosError} from 'axios';
import {NextApiResponse} from 'next';
import useSWR, {SWRResponse} from 'swr';

/*
 * Types.
 */

export type NetResponse<T = void> = NextApiResponse<
  | T
  | void
  | {
      error: string | unknown;
    }
>;

/*
 * Utilities.
 */

export async function netGet<T>(url: string): Promise<T> {
  const response = await axios.get<T>(url);
  return response.data;
}

export async function netPost<T, V = undefined>(url: string, body?: V): Promise<T> {
  const response = await axios.post<T>(url, body);
  return response.data;
}

export async function netPatch<T, V = undefined>(url: string, body?: V): Promise<T> {
  const response = await axios.patch<T>(url, body);
  return response.data;
}

export async function netDelete<T, V = undefined>(url: string, body?: V): Promise<T> {
  const response = await axios.delete<T>(url, body);
  return response.data;
}

export function parseQueryString(queryParam: string | string[]): string {
  return typeof queryParam === 'string' ? queryParam : queryParam[0];
}

/*
 * Hooks.
 */

export function useNetGet<T>(url: string): SWRResponse<T, AxiosError<Error>> {
  return useSWR<T, AxiosError<Error>>(url, netGet);
}
