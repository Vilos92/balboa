import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';

import {Button as ButtonComponent} from '../../components/Button';

export default {
  title: 'Components/Button',
  component: ButtonComponent
} as ComponentMeta<typeof ButtonComponent>;

const Template: ComponentStory<typeof ButtonComponent> = args => (
  <ButtonComponent {...args}>Hello Button</ButtonComponent>
);

export const Button = Template.bind({});
Button.args = {
  backgroundColor: '#800080'
};
