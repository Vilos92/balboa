import {useEffect, useState} from 'react';

/*
 * Utilities.
 */

function formatLocationString(): string {
  const {protocol, hostname, pathname} = globalThis.location;
  return `${protocol}//${hostname}${pathname}`;
}

/*
 * Hooks.
 */

export function useLocationString(): string {
  const [locationString, setLocationString] = useState('');
  // window.location is not available in SSR, so set this in an effect.
  useEffect(() => {
    setLocationString(formatLocationString());
  }, []);

  return locationString;
}
