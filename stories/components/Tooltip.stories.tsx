import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import tw from 'twin.macro';

import {Tooltip as TooltipComponent} from '../../components/popover/Tooltip';

/*
 * Types.
 */

type TooltipType = typeof TooltipComponent;

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
  component: TooltipComponent,
  args: {
    isVisible: true,
    placement: 'right',
    text: 'Tooltip!'
  }
} as ComponentMeta<TooltipType>;

const Template: ComponentStory<TooltipType> = args => (
  <StyledTemplateDiv>
    <TooltipComponent {...args}>
      <StyledAnchorDiv>Anchor</StyledAnchorDiv>
    </TooltipComponent>
  </StyledTemplateDiv>
);

/*
 * Stories.
 */

export const Tooltip = Template.bind({});
