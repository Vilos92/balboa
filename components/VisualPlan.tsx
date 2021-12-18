import {FC} from 'react';
import tw, {styled} from 'twin.macro';

import {Plan} from '../models/plan';

/*
 * Types.
 */

interface VisualPlanProps {
  plan: Plan;
}

/*
 * Styles.
 */

const StyledPlanDiv = tw.div`
  flex
  flex-row
  items-center
  gap-1
`;

const StyledColorSvg = styled.svg`
  height: 1em;

  ${tw`
    inline-block
  `}
`;

/*
 * Component.
 */

export const VisualPlan: FC<VisualPlanProps> = ({plan}) => (
  <StyledPlanDiv>
    <StyledColorSvg viewBox='0 0 16 16'>
      <circle cx={8} cy={8} r={8} fill={plan.color} />
    </StyledColorSvg>{' '}
    <span>{plan.title}</span>
  </StyledPlanDiv>
);
