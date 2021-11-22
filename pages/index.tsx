import {ChangeEvent, FC, useEffect, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {ColorInput, DateInput, TextAreaInput, TextInput} from '../components/Inputs';
import {Tooltip} from '../components/Tooltip';
import {GetPositionStackResponse} from '../externalApi/geocoder';
import {geolocationApi} from './api/geolocation';
import {useNetGet} from './utils/hooks';

/*
 * Types.
 */

interface LandingFormProps {
  planColor: string;
  setPlanColor: (string) => void;
  onNextStage: () => void;
}

interface LandingSuccessProps {
  planColor: string;
}

interface ColorInputWithTooltipProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface LocationVisualizerProps {
  location: string;
}

interface LandingFormButtonProps {
  backgroundColor: string;
}

/*
 * Styles.
 */

const StyledBodyDiv = tw.div`
  bg-gray-800
`;

const StyledContainerDiv = tw.div`
  flex
  flex-col
  items-center
  justify-center
  min-h-screen
  py-2
`;

const StyledLandingDiv = tw.div`
  p-3
  bg-white
  rounded-2xl
  shadow-md
  w-full
  sm:w-7/12
`;

const StyledLandingH1 = tw.h1`
  text-white
  text-3xl
  text-center
  mb-6
`;

const StyledLandingH2 = tw.h2`
  text-lg
  text-center
  font-bold
  mb-2
`;

const StyledGroupDiv = tw.div`
  mb-2
`;

const StyledGroupTitleDiv = tw.div`
  text-gray-700
  font-bold
  w-full
  mb-0.5
`;

const StyledNameColorGroupDiv = tw(StyledGroupDiv)`
  flex
  flex-row
`;

const StyledColorInput = tw(ColorInput)`
  flex-none
  mt-2.5
  mr-3
`;

const StyledTextAreaInput = styled(TextAreaInput)`
  min-height: 72px;
`;

const LandingFormButton = styled.button.attrs<LandingFormButtonProps>(({backgroundColor}) => ({
  style: {backgroundColor}
}))<LandingFormButtonProps>`
  ${tw`
    hover:brightness-150
    text-white
    font-bold
    py-2
    px-4
    rounded
    focus:outline-none
    focus:shadow
  `}

  text-shadow: 0 2px 4px rgba(0,0,0,0.10);
`;

/*
 * Page.
 */

const Landing: FC = () => {
  const [stage, setStage] = useState(0);
  const onNextStage = () => setStage(stage + 1);

  const [planColor, setPlanColor] = useState('#ffffff');
  useEffect(() => {
    const randColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setPlanColor(randColor);
  }, []);

  const content =
    stage === 0 ? (
      <LandingForm planColor={planColor} setPlanColor={setPlanColor} onNextStage={onNextStage} />
    ) : (
      <LandingSuccess planColor={planColor} />
    );

  return (
    <StyledBodyDiv>
      <StyledContainerDiv>
        <StyledLandingH1>Grueplan</StyledLandingH1>
        <StyledLandingDiv>
          <StyledLandingH2>Let's make a plan.</StyledLandingH2>
          {content}
        </StyledLandingDiv>
      </StyledContainerDiv>
    </StyledBodyDiv>
  );
};

export default Landing;

/*
 * Components.
 */

const LandingForm: FC<LandingFormProps> = ({planColor, setPlanColor, onNextStage}) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
  const onChangeColor = (event: ChangeEvent<HTMLInputElement>) => setPlanColor(event.target.value);

  const onChangeStart = (event: ChangeEvent<HTMLInputElement>) => {
    const startDate = new Date(event.target.value);
    const endDate = new Date(end);

    setStart(event.target.value);
    if (startDate > endDate) setEnd(event.target.value);
  };
  const onChangeEnd = (event: ChangeEvent<HTMLInputElement>) => {
    const startDate = new Date(start);
    const endDate = new Date(event.target.value);

    setEnd(event.target.value);
    if (endDate < startDate) setStart(event.target.value);
  };

  const onChangeLocation = (event: ChangeEvent<HTMLInputElement>) => setLocation(event.target.value);

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value);

  // Initial date should only be set on the client (no SSR).
  useEffect(() => {
    const defaultDate = computeDefaultDate();
    setStart(defaultDate);
    setEnd(defaultDate);
  }, []);

  // Cannot select dates before today.
  const minimumDate = computeInputValueFromDate(new Date());

  return (
    <form>
      <StyledGroupTitleDiv>What should we title this plan?</StyledGroupTitleDiv>
      <StyledNameColorGroupDiv>
        <ColorInputWithTooltip value={planColor} onChange={onChangeColor} />
        <TextInput label='Title' value={title} onChange={onChangeTitle} />
      </StyledNameColorGroupDiv>

      <StyledGroupDiv>
        <StyledGroupTitleDiv>When is the plan?</StyledGroupTitleDiv>
        <DateInput label='Start' value={start} onChange={onChangeStart} min={minimumDate} />
        <DateInput label='End' value={end} onChange={onChangeEnd} min={minimumDate} />
      </StyledGroupDiv>

      <StyledGroupDiv>
        <StyledGroupTitleDiv>Where is the plan?</StyledGroupTitleDiv>
        <TextInput label='Location' value={location} onChange={onChangeLocation} />
        {location.length > 0 && <LocationVisualizer location={location} />}
      </StyledGroupDiv>

      <StyledGroupDiv>
        <StyledGroupTitleDiv>What is the plan?</StyledGroupTitleDiv>
        <StyledTextAreaInput label='Description' value={description} onChange={onChangeDescription} />
      </StyledGroupDiv>

      <LandingFormButton type='button' backgroundColor={planColor} onClick={onNextStage}>
        Mark it!
      </LandingFormButton>
    </form>
  );
};

const ColorInputWithTooltip: FC<ColorInputWithTooltipProps> = ({value, onChange}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

  const onChangeColor = (event: ChangeEvent<HTMLInputElement>) => {
    setIsTooltipVisible(false);
    onChange(event);
  };

  const onClickTooltip = () => setIsTooltipVisible(false);

  return (
    <Tooltip isVisible={isTooltipVisible} text='Set a color' onClick={onClickTooltip} placement='left'>
      <StyledColorInput label='Color' value={value} onChange={onChangeColor} />
    </Tooltip>
  );
};

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const LocationVisualizer: FC<LocationVisualizerProps> = ({location}) => {
  const debouncedLocation = useDebounce(location, 1000);

  const url = new URL(geolocationApi, window.location.origin);
  url.searchParams.set('query', debouncedLocation);

  const {data, error} = useNetGet<GetPositionStackResponse>(url.href);

  return <div>{JSON.stringify(data)}</div>;
};

const LandingSuccess: FC<LandingSuccessProps> = ({planColor}) => {
  return (
    <>
      <input id='share' type='text' value='https://grueplan.com/ijalfk' readOnly />
      <LandingFormButton type='button' backgroundColor={planColor}>
        Copy
      </LandingFormButton>
    </>
  );
};

/*
 * Helpers.
 */

function computeDefaultDate(): string {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  return computeInputValueFromDate(start);
}

function computeInputValueFromDate(date: Date): string {
  const [month, day, year] = date.toLocaleDateString().split('/');
  return `${year}-${month}-${day}`;
}
