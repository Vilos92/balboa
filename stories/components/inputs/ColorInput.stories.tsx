import {ComponentMeta, ComponentStory} from '@storybook/react';
import React, {useState} from 'react';

import {ColorInput as ColorInputComponent} from '../../../components/inputs/ColorInput';

/*
 * Types.
 */

type ColorInputType = typeof ColorInputComponent;

/*
 * Config.
 */

export default {
  title: 'Components/Inputs',
  component: ColorInputComponent
} as ComponentMeta<ColorInputType>;

const Template: ComponentStory<ColorInputType> = args => {
  const [color, setColor] = useState('#800080');

  return <ColorInputComponent {...args} value={color} onChange={setColor} />;
};

/*
 * Stories.
 */

export const ColorInput = Template.bind({});
