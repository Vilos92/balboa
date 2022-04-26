/*
 * NOTE: Any changes to the below utilities should be reflected in public/theme.js
 */

/*
 * Types.
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
 * JSDoc in public/theme.js
 */
export function getInitialTheme(): ThemesEnum {
  if (!global.window) return ThemesEnum.LIGHT;
  return global.window.__getInitialTheme();
}

/**
 * JSDoc in public/theme.js
 */
export function rawSetTheme(theme: ThemesEnum) {
  if (!global.window) return;
  global.window.__rawSetTheme(theme);
}
