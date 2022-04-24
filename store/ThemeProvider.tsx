import React, {FC, useContext} from 'react';

import {Handler} from '../types/common';

/*
 * Types.
 */

enum ThemesEnum {
  LIGHT = 'light',
  DARK = 'dark'
}

interface ThemeContextState {
  theme: ThemesEnum;
  setTheme?: (updatedTheme: ThemesEnum) => void;
}

/*
 * Constants.
 */

const themeStorageKey = 'color-theme';

/*
 * Helpers.
 */

/**
 * Determine the initial theme for our user by checking in order:
 * - Their preference in local storage.
 * - Their window preference.
 * - If no matches, default to a light theme.
 */
const getInitialTheme = (): ThemesEnum => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const themePref = window.localStorage.getItem(themeStorageKey);
    if (typeof themePref === 'string' && Object.values(ThemesEnum).includes(themePref as ThemesEnum)) {
      return themePref as ThemesEnum;
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return ThemesEnum.DARK;
    }
  }

  return ThemesEnum.LIGHT;
};

/*
 * Context.
 */

const ThemeContext = React.createContext<ThemeContextState>({theme: getInitialTheme()});

/*
 * Provider.
 */

export const ThemeProvider: FC = ({children}) => {
  const [theme, setTheme] = React.useState<ThemesEnum>(getInitialTheme);

  const rawSetTheme = (theme: ThemesEnum) => {
    const oldTheme = theme === ThemesEnum.DARK ? ThemesEnum.LIGHT : ThemesEnum.DARK;

    const root = window.document.documentElement;
    root.classList.remove(oldTheme);
    root.classList.add(theme);

    localStorage.setItem(themeStorageKey, theme);
  };

  React.useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  return <ThemeContext.Provider value={{theme, setTheme}}>{children}</ThemeContext.Provider>;
};

/*
 * Hook.
 */

export const useThemeContext = () => {
  const {theme, setTheme} = useContext(ThemeContext);

  const toggleTheme = () => {
    if (!setTheme) return;

    if (theme === ThemesEnum.LIGHT) {
      setTheme(ThemesEnum.DARK);
      return;
    }
    setTheme(ThemesEnum.LIGHT);
  };

  return {theme, toggleTheme};
};
