import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import tw from 'twin.macro';

import {IconTypesEnum} from '../../components/Icon';
import {LandingButton as LandingButtonComponent} from '../../components/LandingButton';

/*
 * Types.
 */

type LandingButtonType = typeof LandingButtonComponent;

/*
 * Styles.
 */

const StyledBackgroundDiv = tw.div`
  bg-black
  inline-flex
  w-full
  p-4
`;

/*
 * Config.
 */

export default {
  title: 'Components/LandingButton',
  component: LandingButtonComponent
} as ComponentMeta<LandingButtonType>;

const Template: ComponentStory<LandingButtonType> = args => (
  <StyledBackgroundDiv>
    <LandingButtonComponent {...args} />
  </StyledBackgroundDiv>
);

/*
 * Stories.
 */

export const CreateLandingButton = Template.bind({});
CreateLandingButton.args = {
  text: 'Create a plan',
  iconType: IconTypesEnum.ADD_CIRCLE
};

export const UpcomingLandingButton = Template.bind({});
UpcomingLandingButton.args = {
  text: 'Upcoming plans',
  iconType: IconTypesEnum.LIST_UNORDERED
};
