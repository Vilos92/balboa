/*
 * Types.
 */

/**
 * The below methods are defined and attached to window in public/scripts/theme.js
 * The script itself is run in _document.tsx
 */
declare global {
  interface Window {
    __getInitialTheme: () => ThemesEnum;
    __rawSetTheme: (theme: ThemesEnum) => void;
  }
}

export enum ThemesEnum {
  LIGHT = 'light',
  DARK = 'dark'
}

/*
 * Utilities.
 */

/**
 * JSDoc in public/scripts/theme.js
 */
export function getInitialTheme(): ThemesEnum {
  if (!globalThis.window) return ThemesEnum.LIGHT;
  return globalThis.window.__getInitialTheme();
}

/**
 * JSDoc in public/scripts/theme.js
 */
export function rawSetTheme(theme: ThemesEnum) {
  if (!globalThis.window) return;
  globalThis.window.__rawSetTheme(theme);
}
