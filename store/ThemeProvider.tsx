import React, {FC, useContext, useEffect, useState} from 'react';

import {ThemesEnum, getInitialTheme, rawSetTheme} from '../utils/theme';

interface ThemeContextState {
  theme: ThemesEnum;
  setTheme?: (updatedTheme: ThemesEnum) => void;
}

/*
 * Context.
 */

const ThemeContext = React.createContext<ThemeContextState>({theme: getInitialTheme()});

/*
 * Provider.
 */

export const ThemeProvider: FC = ({children}) => {
  const [theme, setTheme] = useState<ThemesEnum>(getInitialTheme);

  useEffect(() => {
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
