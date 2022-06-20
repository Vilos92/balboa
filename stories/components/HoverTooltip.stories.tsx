import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import tw from 'twin.macro';

import {HoverTooltip as HoverTooltipComponent} from '../../components/popover/HoverTooltip';

/*
 * Types.
 */

type TooltipType = typeof HoverTooltipComponent;

/*
 * Styles.
 */

const StyledTemplateDiv = tw.div`
  w-20
`;

const StyledAnchorDiv = tw.div`
  flex
  justify-center
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
  component: HoverTooltipComponent,
  args: {
    placement: 'right',
    text: 'Hover Tooltip!'
  }
} as ComponentMeta<TooltipType>;

const Template: ComponentStory<TooltipType> = args => (
  <StyledTemplateDiv>
    <HoverTooltipComponent {...args}>
      <StyledAnchorDiv>Anchor</StyledAnchorDiv>
    </HoverTooltipComponent>
  </StyledTemplateDiv>
);

/*
 * Stories.
 */

export const HoverTooltip = Template.bind({});
