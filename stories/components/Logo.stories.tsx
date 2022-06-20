import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';

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

const Template: ComponentStory<LogoType> = args => <LogoComponent {...args} />;

/*
 * Stories.
 */

export const Logo = Template.bind({});
