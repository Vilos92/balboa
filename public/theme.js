/*
 * NOTE: This script should always reflect the contents of utils/theme.ts
 */

/*
 * Constants.
 */

const ThemesEnum = {
  LIGHT: 'light',
  DARK: 'dark'
};

const themeStorageKey = 'color-theme';

/*
 * Utilities.
 */

function getInitialTheme() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return ThemesEnum.LIGHT;
  }

  const themePref = window.localStorage.getItem(themeStorageKey);
  if (typeof themePref === 'string' && Object.values(ThemesEnum).includes(themePref)) {
    return themePref;
  }

  const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
  return userMedia.matches ? ThemesEnum.DARK : ThemesEnum.LIGHT;
}

function rawSetTheme(theme) {
  const oldTheme = theme === ThemesEnum.DARK ? ThemesEnum.LIGHT : ThemesEnum.DARK;

  const root = window.document.documentElement;
  root.classList.remove(oldTheme);
  root.classList.add(theme);

  localStorage.setItem(themeStorageKey, theme);
}

// Setup initial theme.
const initialTheme = getInitialTheme();
rawSetTheme(initialTheme);
