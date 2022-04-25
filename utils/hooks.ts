import {useMediaQuery} from '@react-hook/media-query';
import {RefObject, useCallback, useEffect, useRef, useState} from 'react';
import {useResizeDetector} from 'react-resize-detector';

import {Handler} from '../types/common';

/*
 * Types.
 */

type SetTimeout = (handler: Handler, timeout?: number) => void;
type ClearTimeout = Handler;

type OnResize = (resizeWidth?: number, resizeHeight?: number) => void;

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

export function useInitialEffect(handler: Handler) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current === true) return;

    handler();
    isMounted.current = true;
  });
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

export function useDebounce(handler: Handler, delay: number) {
  const [setDebounceTimeout] = useTimeout();

  const debouncedHandler = () => {
    setDebounceTimeout(() => {
      handler();
    }, delay);
  };

  return debouncedHandler;
}

export function useDebounceValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const updateValue = () => setDebouncedValue(value);
  const debouncedUpdateValue = useDebounce(updateValue, delay);

  useEffect(() => {
    debouncedUpdateValue();
  }, [debouncedUpdateValue]);

  return debouncedValue;
}

export function useClickWindow<T extends HTMLElement>(onClick: Handler) {
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

export function useHover<T extends HTMLElement>(): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);

  const [hasHover, setHasHover] = useState(false);

  const handleMouseOver = () => setHasHover(true);
  const handleMouseOut = () => setHasHover(false);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener('mouseover', handleMouseOver);
    ref.current.addEventListener('mouseout', handleMouseOut);

    const hoverElement = ref.current;

    return () => {
      hoverElement.removeEventListener('mouseover', handleMouseOver);
      hoverElement.removeEventListener('mouseout', handleMouseOut);
    };
  });

  return [ref, hasHover];
}

export function useDetectResize<T>(onResize: OnResize) {
  const {ref} = useResizeDetector<T>({onResize});
  return ref;
}

export function useMediaBreakpoint() {
  const isScreenSmall = useMediaQuery('only screen and (min-width: 640px)');
  const isScreenMobile = !isScreenSmall;
  return {isScreenSmall, isScreenMobile};
}

/**
 * Determine if currently rendering from the client. Always return false
 * on first render to keep consistency between SSR and client rendering.
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useInitialEffect(() => {
    setIsClient(typeof window !== 'undefined');
  });

  return isClient;
}
