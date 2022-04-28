/*
 * Utilities.
 */

export function formatLocationString(): string {
  if (!globalThis) return '';

  const {protocol, hostname, pathname} = globalThis.location;
  return `${protocol}//${hostname}${pathname}`;
}
