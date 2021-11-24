import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import {ChangeEvent, FC, useEffect, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {Body, Card} from '../components/Commons';
import {ColorInput, DateInput, TextAreaInput, TextInput} from '../components/Inputs';
import {Tooltip} from '../components/Tooltip';

const LocationVisualizer = dynamic(() => import('../components/LocationVisualizer'), {
  loading: () => <p>Loading map</p>,
  ssr: false
});

/*
 * Types.
 */

interface ColorInputWithTooltipProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface LandingFormButtonProps {
  backgroundColor: string;
}

/*
 * Styles.
 */

const StyledLandingH2 = tw.h2`
  text-lg
  text-center
  font-bold
  mb-2
`;

const StyledGroupDiv = tw.div`
  mb-2
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

const LandingPage: FC = () => {
  return (
    <Body>
      <Card>
        <StyledLandingH2>Enter your event details here</StyledLandingH2>
        <LandingForm />
      </Card>
    </Body>
  );
};

export default LandingPage;

/*
 * Components.
 */

const LandingForm: FC = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#ffffff');
  useEffect(() => {
    const randColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setColor(randColor);
  }, []);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [hasLocationFocused, setHasLocationFocused] = useState(false);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
  const onChangeColor = (event: ChangeEvent<HTMLInputElement>) => setColor(event.target.value);

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
  const onFocusLocation = () => setHasLocationFocused(true);

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value);

  // Initial date should only be set on the client (no SSR).
  useEffect(() => {
    const defaultDate = computeDefaultDate();
    setStart(defaultDate);
    setEnd(defaultDate);
  }, []);

  // Cannot select dates before today.
  const minimumDate = computeInputValueFromDate(new Date());

  const onClick = async () => {
    const plan = await postPlan({title, color, start, end, location, description});
    router.push(`plans/${plan.id}`);
  };

  return (
    <form>
      <StyledNameColorGroupDiv>
        <ColorInputWithTooltip value={color} onChange={onChangeColor} />
        <TextInput label='Title' value={title} onChange={onChangeTitle} />
      </StyledNameColorGroupDiv>

      <StyledGroupDiv>
        <DateInput label='Start' value={start} onChange={onChangeStart} min={minimumDate} />
        <DateInput label='End' value={end} onChange={onChangeEnd} min={minimumDate} />
      </StyledGroupDiv>

      <StyledGroupDiv>
        <TextInput label='Location' value={location} onChange={onChangeLocation} onFocus={onFocusLocation} />
        {(hasLocationFocused || location.length > 0) && <LocationVisualizer location={location} />}
      </StyledGroupDiv>

      <StyledGroupDiv>
        <StyledTextAreaInput label='Description' value={description} onChange={onChangeDescription} />
      </StyledGroupDiv>

      <LandingFormButton type='button' backgroundColor={color} onClick={onClick}>
        Go time!
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
