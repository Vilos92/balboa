import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import tw from 'twin.macro';

import {Card as CardComponent} from '../../components/Card';

/*
 * Types.
 */

type CardType = typeof CardComponent;

/*
 * Styles.
 */

const StyledBackgroundDiv = tw.div`
  bg-black
  w-60
  p-4
`;

const StyledCard = tw(CardComponent)`
  w-52
  h-52
`;

/*
 * Config.
 */

export default {
  title: 'Components/Common',
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

export const Card = Template.bind({});

export const CardWithContent = Template.bind({});
CardWithContent.args = {
  children: <div>Hello</div>
};
