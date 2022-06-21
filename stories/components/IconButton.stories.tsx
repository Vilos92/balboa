import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';

import {IconTypesEnum} from '../../components/Icon';
import {IconButton as IconButtonComponent} from '../../components/IconButton';

/*
 * Types.
 */

type IconButtonType = typeof IconButtonComponent;

/*
 * Config.
 */

// Lift the icon slightly on hover.
const computeTransform = (hasHover: boolean) => {
  const yTranslatePct = hasHover ? -12.5 : 0;
  return `translate(0, ${yTranslatePct}%)`;
};

export default {
  title: 'Components/Button/IconButton',
  component: IconButtonComponent,
  args: {
    iconType: IconTypesEnum.ADD_CIRCLE,
    hoverFill: 'red'
  }
} as ComponentMeta<IconButtonType>;

const Template: ComponentStory<IconButtonType> = args => (
  <IconButtonComponent {...args}>Icon Button</IconButtonComponent>
);

/*
 * Stories.
 */

export const Standard = Template.bind({});

export const Animated = Template.bind({});
Animated.args = {
  computeTransform
};
