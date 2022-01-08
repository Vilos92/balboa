import {useCallback, useEffect, useRef, useState} from 'react';

/*
 * Types.
 */

type SetTimeout = (handler: () => void, timeout?: number) => void;
type ClearTimeout = () => void;

/*
 * Hooks.
 */

export function useTimeout(): [SetTimeout, ClearTimeout] {
  const timeoutRef = useRef<number>();
  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const setTimeoutCallback: SetTimeout = useCallback((handler: () => void, timeout?: number) => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(handler, timeout);
  }, []);

  const clearTimeoutCallback: ClearTimeout = useCallback(() => window.clearTimeout(timeoutRef.current), []);

  return [setTimeoutCallback, clearTimeoutCallback];
}

export function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [setDebounceTimeout, clearDebounceTimeout] = useTimeout();

  useEffect(() => {
    clearDebounceTimeout();

    setDebounceTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearDebounceTimeout();
  }, [value, delay]);

  return debouncedValue;
}
