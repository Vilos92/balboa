import {useCallback, useEffect, useRef, useState} from 'react';

/*
 * Hooks
 */

export function useTimeout() {
  const timeoutRef = useRef<number>();
  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const setTimeoutCallback = useCallback((handler: () => void, timeout?: number) => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(handler, timeout);
  }, []);

  const clearTimeoutCallback = useCallback(() => window.clearTimeout(timeoutRef.current), []);

  return [setTimeoutCallback, clearTimeoutCallback];
}

export function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [setTimeout] = useTimeout();

  useEffect(() => {
    setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [value, delay]);

  return debouncedValue;
}
