import {SessionProvider} from 'next-auth/react';
import {AppProps} from 'next/app';
import {FC} from 'react';

import GlobalStyles from './../components/GlobalStyles';

const App: FC<AppProps> = ({Component, pageProps}) => (
  <SessionProvider session={pageProps.session}>
    <GlobalStyles />
    <Component {...pageProps} />
  </SessionProvider>
);

export default App;
