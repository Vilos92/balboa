/*
 * Types.
 */

export enum ThemesEnum {
  LIGHT = 'light',
  DARK = 'dark'
}

/*
 * Constants.
 */

const themeStorageKey = 'color-theme';

/*
 * Utilities.
 */

/**
 * Determine the initial theme for our user by checking in order:
 * - Their preference in local storage.
 * - Their window preference.
 * - If no matches, default to a light theme.
 */
export function getInitialTheme(): ThemesEnum {
  if (typeof window === 'undefined' || !window.localStorage) {
    return ThemesEnum.LIGHT;
  }

  const themePref = window.localStorage.getItem(themeStorageKey);
  if (typeof themePref === 'string' && Object.values(ThemesEnum).includes(themePref as ThemesEnum)) {
    return themePref as ThemesEnum;
  }

  const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
  return userMedia.matches ? ThemesEnum.DARK : ThemesEnum.LIGHT;
}

export function rawSetTheme(theme: ThemesEnum) {
  const oldTheme = theme === ThemesEnum.DARK ? ThemesEnum.LIGHT : ThemesEnum.DARK;

  const root = window.document.documentElement;
  root.classList.remove(oldTheme);
  root.classList.add(theme);

  localStorage.setItem(themeStorageKey, theme);
}
