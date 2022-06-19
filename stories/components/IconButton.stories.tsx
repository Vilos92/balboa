import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';

import {IconTypesEnum} from '../../components/Icon';
import {IconButton as IconButtonComponent} from '../../components/IconButton';

// Lift the icon slightly on hover.
const computeTransform = (hasHover: boolean) => {
  const yTranslatePct = hasHover ? -12.5 : 0;
  return `translate(0, ${yTranslatePct}%)`;
};

export default {
  title: 'Components/Button',
  component: IconButtonComponent,
  args: {
    iconType: IconTypesEnum.ADD_CIRCLE,
    hoverFill: 'red'
  }
} as ComponentMeta<typeof IconButtonComponent>;

const Template: ComponentStory<typeof IconButtonComponent> = args => (
  <IconButtonComponent {...args}>Icon Button</IconButtonComponent>
);

export const IconButton = Template.bind({});

export const IconButtonWithAnimation = Template.bind({});
IconButtonWithAnimation.args = {
  computeTransform
};
