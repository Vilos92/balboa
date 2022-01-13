import {useCallback, useEffect, useRef, useState} from 'react';

import {Handler} from '../types/common';

/*
 * Types.
 */

type SetTimeout = (handler: Handler, timeout?: number) => void;
type ClearTimeout = Handler;

/*
 * Hooks.
 */

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  // The previous value is returned before the useEffect hook runs.
  return ref.current;
}

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
  const [setDebounceTimeout] = useTimeout();

  useEffect(() => {
    setDebounceTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebounceHandler(handler: Handler, delay: number) {
  const [setDebounceTimeout] = useTimeout();

  const debouncedHandler = () => {
    setDebounceTimeout(() => {
      handler();
    }, delay);
  };

  return debouncedHandler;
}

export function useClickWindow<T extends HTMLElement>(onClick: () => void) {
  const elementRef = useRef<T>(null);

  const onClickWindow = useCallback(
    (event: globalThis.MouseEvent) => {
      // We must cast the target to Node as per official rec:
      // https://github.com/Microsoft/TypeScript/issues/15394#issuecomment-297495746
      if (elementRef.current?.contains(event.target as Node)) return;
      onClick();
    },
    [onClick]
  );

  useEffect(() => {
    window.addEventListener('click', onClickWindow);

    return () => {
      window.removeEventListener('click', onClickWindow);
    };
  }, [onClickWindow]);

  return elementRef;
}
