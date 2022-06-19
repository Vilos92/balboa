import * as NextImage from 'next/image';

import GlobalStyles from '../components/GlobalStyles';

// Do not attempt to use optimized Next Images for storybook.
const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: props => <OriginalNextImage {...props} unoptimized />
});

// Decorator which includes Tailwind styles.
const globalStylesDecorator = story => (
  <>
    <GlobalStyles />
    {story()}
  </>
);

export const decorators = [globalStylesDecorator];

// General parameters.
export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};
