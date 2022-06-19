import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';

import {Button as ButtonComponent} from '../../components/Button';

/*
 * Types.
 */

type ButtonType = typeof ButtonComponent;

/*
 * Config.
 */

export default {
  title: 'Components/Button',
  component: ButtonComponent
} as ComponentMeta<ButtonType>;

const Template: ComponentStory<ButtonType> = args => (
  <ButtonComponent {...args}>Hello Button</ButtonComponent>
);

/*
 * Stories.
 */

export const Button = Template.bind({});
Button.args = {
  backgroundColor: '#800080'
};
