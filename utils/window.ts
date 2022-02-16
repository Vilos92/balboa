/*
 * Utilities.
 */

export function formatLocationString(): string {
  const {protocol, hostname, pathname} = globalThis.location;
  return `${protocol}//${hostname}${pathname}`;
}
