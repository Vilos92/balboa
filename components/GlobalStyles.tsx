// @ts-nocheck
// nocheck is needed for the mixing between createGlobalStyle and tw.
import React, {FC} from 'react';
import {createGlobalStyle} from 'styled-components';
import tw, {GlobalStyles as BaseStyles, theme} from 'twin.macro';

const CustomStyles = createGlobalStyle`
  body {
    -webkit-tap-highlight-color: ${theme`colors.purple.500`};
    ${tw`antialiased`}
  }
`;

const GlobalStyles: FC = () => {
  return (
    <>
      <BaseStyles />
      <CustomStyles />
    </>
  );
};

export default GlobalStyles;
