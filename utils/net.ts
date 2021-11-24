import axios from 'axios';

/*
 * Types.
 */

type NetGet<T> = (url: string) => Promise<T>;

export interface NetResponse {
  message: string;
}

/*
 * Utilities.
 */

export async function netGet<T>(url: string): Promise<T> {
  const response = await axios.get<T>(url);
  return response.data;
}

export function makeNetGet<T>(): NetGet<T> {
  return async (url: string) => {
    const response = await axios.get<T>(url);
    return response.data;
  };
}

export async function netPost<T, V>(url: string, body?: T): Promise<V> {
  const response = await axios.post<V>(url, body);
  return response.data;
}
