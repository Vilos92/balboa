import {FC} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {PageSkeleton} from '../components/PageSkeleton';
import {persistor, store} from './store';

/*
 * Component.
 */

/**
 * Provider children with the application redux store.
 */
export const AppProvider: FC = ({children}) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<PageSkeleton />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
