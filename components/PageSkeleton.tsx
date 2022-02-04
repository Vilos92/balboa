import React, {FC} from 'react';

import {FooterSpacer} from './AccountFooter';
import {ColumnJustified} from './Commons';
import {Header} from './Header';
import {LoadingGrue} from './LoadingGrue';

/*
 * Components.
 */

export const PageSkeleton: FC = () => (
  <ColumnJustified>
    <Header />
    <LoadingGrue />
    <FooterSpacer />
  </ColumnJustified>
);
