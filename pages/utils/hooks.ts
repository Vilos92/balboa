import {AxiosError} from 'axios';
import useSWR, {SWRResponse} from 'swr';

import {makeNetGet} from './net';

/*
 * Hooks.
 */

export function useNetGet<T>(url: string): SWRResponse<T, AxiosError<Error>> {
  const netGet = makeNetGet<T>();
  return useSWR<T, AxiosError<Error>>(url, netGet);
}
