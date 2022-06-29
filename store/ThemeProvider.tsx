import React, {FC, PropsWithChildren, useContext, useEffect, useState} from 'react';

import {ThemesEnum, getInitialTheme, rawSetTheme} from '../utils/theme';

/*
 * Types.
 */

type ThemeProviderProps = PropsWithChildren;

interface ThemeContextState {
  theme: ThemesEnum;
  setTheme: (updatedTheme: ThemesEnum) => void;
}

/*
 * Context.
 */

const ThemeContext = React.createContext<ThemeContextState>({
  theme: getInitialTheme(),
  setTheme: () => undefined
});

/*
 * Provider.
 */

export const ThemeProvider: FC<ThemeProviderProps> = ({children}) => {
  const [theme, setTheme] = useState<ThemesEnum>(getInitialTheme);

  useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  return <ThemeContext.Provider value={{theme, setTheme}}>{children}</ThemeContext.Provider>;
};

/*
 * Hooks.
 */

export const useThemeContext = () => {
  const {theme, setTheme} = useContext(ThemeContext);

  const toggleTheme = () => {
    const updatedTheme = theme === ThemesEnum.LIGHT ? ThemesEnum.DARK : ThemesEnum.LIGHT;
    setTheme(updatedTheme);
  };

  return {theme, toggleTheme};
};
