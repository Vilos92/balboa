import {SessionProvider} from 'next-auth/react';
import {AppProps} from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import {FC} from 'react';

import {ThemeProvider} from '../store/ThemeProvider';
import GlobalStyles from './../components/GlobalStyles';

const App: FC<AppProps> = ({Component, pageProps}) => (
  <SessionProvider session={pageProps.session}>
    <NextNProgress />
    <GlobalStyles />
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  </SessionProvider>
);

export default App;
