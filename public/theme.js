/**
 * IIFE wrapper to enable private variables and functions.
 */
(function () {
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

  /**
   * Determine the initial theme for our user by checking in order:
   * - Their preference in local storage.
   * - Their window preference.
   * - If no matches, default to a light theme.
   */
  function getInitialTheme() {
    const themePref = window.localStorage.getItem(themeStorageKey);
    if (Object.values(ThemesEnum).includes(themePref)) {
      return themePref;
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    return userMedia.matches ? ThemesEnum.DARK : ThemesEnum.LIGHT;
  }

  /**
   * Directly apply a theme to the document root.
   */
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

  // Attach helpers to window for usage in React application.
  window.__getInitialTheme = getInitialTheme;
  window.__rawSetTheme = rawSetTheme;
})();
