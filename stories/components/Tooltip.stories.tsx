import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import tw from 'twin.macro';

import {ColumnJustified} from '../../components/Commons';
import {Tooltip as TooltipComponent} from '../../components/popover/Tooltip';

/*
 * Types.
 */

type TooltipType = typeof TooltipComponent;

/*
 * Styles.
 */

const StyledAnchorDiv = tw.div`
  flex
  items-center

  bg-gray-300
  p-3
  rounded-lg
`;

/*
 * Config.
 */

export default {
  title: 'Components/Popover',
  component: TooltipComponent,
  args: {
    isVisible: true,
    placement: 'right',
    text: 'Tooltip!'
  }
} as ComponentMeta<TooltipType>;

const Template: ComponentStory<TooltipType> = args => (
  <ColumnJustified>
    <TooltipComponent {...args}>
      <StyledAnchorDiv>Anchor</StyledAnchorDiv>
    </TooltipComponent>
  </ColumnJustified>
);

/*
 * Stories.
 */

export const Tooltip = Template.bind({});
