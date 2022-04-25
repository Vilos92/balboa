// @ts-nocheck
// nocheck is needed for the mixing between createGlobalStyle and tw.
import React, {FC} from 'react';
import {createGlobalStyle} from 'styled-components';
import tw, {GlobalStyles as BaseStyles, theme} from 'twin.macro';

const CustomStyles = createGlobalStyle`
  body {
    -webkit-tap-highlight-color: ${theme`colors.purple.400`};
    ${tw`
      antialiased
    `}

    font-family: Lato, sans-serif;
  }
`;

const ThemeStyles = createGlobalStyle`
  .light {
    --bg-primary: #e2e8f0;
    --text-primary: #000000;
  }
  .dark {
    --bg-primary: #334155;
    --text-primary: #ffffff;
  }
  body {
    ${tw`
      bg-primary
      text-primary
      transition-all
      duration-200
      ease-in-out
    `}
  }
`;

const GlobalStyles: FC = () => {
  return (
    <>
      <BaseStyles />
      <CustomStyles />
      <ThemeStyles />
    </>
  );
};

export default GlobalStyles;
