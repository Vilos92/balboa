import {useCallback, useEffect, useRef, useState} from 'react';

/*
 * Hooks
 */

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

export function useTimeout() {
  const timeoutRef = useRef<number>();
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const setTimeoutCallback = useCallback((handler: () => void, timeout?: number) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(handler, timeout);
  }, []);

  const clearTimeoutCallback = useCallback(() => clearTimeout(timeoutRef.current), []);

  return [setTimeoutCallback, clearTimeoutCallback];
}
