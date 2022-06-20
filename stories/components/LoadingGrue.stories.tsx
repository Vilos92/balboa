import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import tw from 'twin.macro';

import {LoadingGrue as LoadingGrueComponent} from '../../components/LoadingGrue';

/*
 * Types.
 */

type LoadingGrueType = typeof LoadingGrueComponent;

/*
 * Styles.
 */

const StyledTemplateDiv = tw.div`
  flex
`;

/*
 * Config.
 */

export default {
  title: 'Components/Grue',
  component: LoadingGrueComponent
} as ComponentMeta<LoadingGrueType>;

const Template: ComponentStory<LoadingGrueType> = args => (
  <StyledTemplateDiv>
    <LoadingGrueComponent {...args} />
  </StyledTemplateDiv>
);

/*
 * Stories.
 */

export const LoadingGrue = Template.bind({});
