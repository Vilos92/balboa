import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';

import {ColumnJustified} from '../../components/Commons';
import {LoadingGrue as LoadingGrueComponent} from '../../components/LoadingGrue';

/*
 * Types.
 */

type LoadingGrueType = typeof LoadingGrueComponent;

/*
 * Config.
 */

export default {
  title: 'Components/Grue',
  component: LoadingGrueComponent
} as ComponentMeta<LoadingGrueType>;

const Template: ComponentStory<LoadingGrueType> = args => (
  <ColumnJustified>
    <LoadingGrueComponent {...args} />
  </ColumnJustified>
);

/*
 * Stories.
 */

export const LoadingGrue = Template.bind({});
