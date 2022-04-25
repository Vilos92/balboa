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
    --bg-secondary: #1f2937;
    --text-primary: #1f2937;
    --text-secondary: #e2e8f0;
  }
  .dark {
    --bg-primary: #334155;
    --bg-secondary: #f1f5f9;
    --text-primary: #e2e8f0;
    --text-secondary: #1f2937;
  }
  body {
    ${tw`
      bg-primary
      text-primary
      transition-colors
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
