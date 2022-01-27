import React, {FC} from 'react';

import {FooterSpacer} from './AccountFooter';
import {ColumnJustifiedContent} from './Commons';
import {Header} from './Header';
import {LoadingGrue} from './LoadingGrue';

/*
 * Components.
 */

export const PageSkeleton: FC = () => (
  <ColumnJustifiedContent>
    <Header />
    <LoadingGrue />
    <FooterSpacer />
  </ColumnJustifiedContent>
);
