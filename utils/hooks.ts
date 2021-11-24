import {AxiosError} from 'axios';
import {useEffect, useState} from 'react';
import useSWR, {SWRResponse} from 'swr';

import {makeNetGet} from './net';

/*
 * Hooks.
 */

export function useNetGet<T>(url: string): SWRResponse<T, AxiosError<Error>> {
  // TODO: Can you just pass the real netGet directly in?
  const netGet = makeNetGet<T>();
  return useSWR<T, AxiosError<Error>>(url, netGet);
}

export function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
