import {ComponentMeta, ComponentStory} from '@storybook/react';
import React, {ChangeEvent, useState} from 'react';

import {TextAreaInput as TextAreaInputComponent} from '../../../components/inputs/TextAreaInput';

/*
 * Types.
 */

type TextAreaInputType = typeof TextAreaInputComponent;

/*
 * Config.
 */

export default {
  title: 'Components/Inputs/TextAreaInput',
  component: TextAreaInputComponent,
  args: {
    label: 'This is the label!'
  }
} as ComponentMeta<TextAreaInputType>;

const Template: ComponentStory<TextAreaInputType> = args => {
  const [value, setValue] = useState('');

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => setValue(event.target.value);

  return <TextAreaInputComponent {...args} value={value} onChange={onChange} />;
};

/*
 * Stories.
 */

export const Standard = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Houston we have a problem'
};
