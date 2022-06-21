import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import tw, {styled} from 'twin.macro';

import {Card as CardComponent} from '../../components/Card';

/*
 * Types.
 */

type CardType = typeof CardComponent;

/*
 * Constants.
 */

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

/*
 * Styles.
 */

const StyledBackgroundDiv = tw.div`
  bg-black
  inline-flex
  p-4
`;

const StyledCard = styled(CardComponent)`
  width: 240px;
  min-height: 240px;
`;

/*
 * Config.
 */

export default {
  title: 'Components/Common/Card',
  component: CardComponent
} as ComponentMeta<CardType>;

const Template: ComponentStory<CardType> = args => (
  <StyledBackgroundDiv>
    <StyledCard {...args} />
  </StyledBackgroundDiv>
);

/*
 * Stories.
 */

export const Standard = Template.bind({});

export const Content = Template.bind({});
Content.args = {
  children: text
};
