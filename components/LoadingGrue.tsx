import React, {FC} from 'react';

import {CenteredContent} from './Commons';
import {GrueSvg} from './svg/GrueSvg';

/**
 * Component.
 */

export const LoadingGrue: FC = () => (
  <CenteredContent>
    <GrueSvg fill='#ffffff' height='64px' />
  </CenteredContent>
);
