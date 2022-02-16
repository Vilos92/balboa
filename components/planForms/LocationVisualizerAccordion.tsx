import dynamic from 'next/dynamic';
import {FC, useEffect, useState} from 'react';
import {animated, useSpring} from 'react-spring';

import {StyledLocationDiv} from './PlanForm';

/*
 * SSR Imports.
 */

const LocationVisualizer = dynamic(() => import('../locationVisualizer/LocationVisualizer'), {
  loading: () => <></>,
  ssr: false
});

/*
 * Types.
 */

interface LocationVisualizerAccordionProps {
  isExpanded: boolean;
  location: string;
}

/*
 * Component.
 */

export const LocationVisualizerAccordion: FC<LocationVisualizerAccordionProps> = ({isExpanded, location}) => {
  const [isExpandedLocal, setIsExpandedLocal] = useState(false);

  useEffect(() => {
    if (isExpanded !== isExpandedLocal) setIsExpandedLocal(isExpanded);
  }, [isExpanded, isExpandedLocal]);

  const style = useSpring({
    from: {height: '0px', opacity: 0},
    to: {height: isExpandedLocal ? '200px' : '0', opacity: 100},
    reverse: !isExpandedLocal
  });

  return (
    <>
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <animated.div style={style}>
        <StyledLocationDiv $isExpanded={isExpandedLocal}>
          <LocationVisualizer location={location} />
        </StyledLocationDiv>
      </animated.div>
    </>
  );
};
