import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';

import {ColumnJustified} from '../../components/Commons';
import {Logo as LogoComponent} from '../../components/Logo';

/*
 * Types.
 */

type LogoType = typeof LogoComponent;

/*
 * Config.
 */

export default {
  title: 'Components/Grue',
  component: LogoComponent
} as ComponentMeta<LogoType>;

const Template: ComponentStory<LogoType> = args => (
  <ColumnJustified>
    <LogoComponent {...args} />
  </ColumnJustified>
);

/*
 * Stories.
 */

export const Logo = Template.bind({});
