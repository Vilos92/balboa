import {FC, useEffect, useState} from 'react';
import tw, {styled} from 'twin.macro';

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

interface LandingFormButtonProps {
  backgroundColor: string;
}

/*
 * Styles.
 */

const BodyDiv = tw.div`
  bg-gray-800
`;

const LandingContainerDiv = tw.div`
  flex
  flex-col
  items-center
  justify-center
  min-h-screen
  py-2
`;

const LandingDiv = tw.div`
  p-3
  bg-white
  rounded-2xl
  shadow-md
  w-full
  sm:w-7/12
`;

const LandingH1 = tw.h1`
  text-white
  text-3xl
  text-center
  mb-6
`;

const LandingH2 = tw.h2`
  text-lg
  text-center
  font-bold
  mb-2
`;

const LandingFormInputGroupDiv = tw.div`
  mb-3
`;

const LandingFormLabel = tw.label`
  block
  text-gray-700
  text-sm
  font-bold
  mb-2
`;

const LandingFormInput = tw.input`
  shadow
  appearance-none
  border
  rounded
  w-full
  py-2
  px-3
  text-gray-700
  leading-tight
  focus:outline-none
  focus:shadow-sm
`;

const LandingFormTextArea = tw.textarea`
  w-full
  px-3
  py-2
  text-gray-700
  border
  rounded-lg
  focus:outline-none
`;

const LandingFormButton = styled.button.attrs<LandingFormButtonProps>(({backgroundColor}) => ({
  style: {backgroundColor}
}))`
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
    <BodyDiv>
      <LandingContainerDiv>
        <LandingH1>Grueplan</LandingH1>
        <LandingDiv>
          <LandingH2>Let's plan</LandingH2>
          {content}
        </LandingDiv>
      </LandingContainerDiv>
    </BodyDiv>
  );
};

export default Landing;

/*
 * Components.
 */

const LandingForm: FC<LandingFormProps> = ({planColor, setPlanColor, onNextStage}) => {
  return (
    <form>
      <LandingFormInputGroupDiv>
        <LandingFormLabel htmlFor='name'>What is the plan?</LandingFormLabel>
        <LandingFormInput id='name' type='text' placeholder='Name' />
      </LandingFormInputGroupDiv>

      <LandingFormInputGroupDiv>
        <LandingFormLabel htmlFor='color'>Color</LandingFormLabel>
        <input
          id='color'
          type='color'
          value={planColor}
          onChange={event => setPlanColor(event.target.value)}
        />
      </LandingFormInputGroupDiv>

      <LandingFormInputGroupDiv>
        <LandingFormLabel htmlFor='start'>When is the plan?</LandingFormLabel>
        <LandingFormInput id='start' type='text' placeholder='Start' />
        <LandingFormInput id='end' type='text' placeholder='End' />
      </LandingFormInputGroupDiv>

      <LandingFormInputGroupDiv>
        <LandingFormLabel htmlFor='description'>How is the plan?</LandingFormLabel>
        <LandingFormTextArea id='description' placeholder='Description' />
      </LandingFormInputGroupDiv>

      <LandingFormInputGroupDiv>
        <LandingFormButton type='button' backgroundColor={planColor} onClick={onNextStage}>
          Next
        </LandingFormButton>
      </LandingFormInputGroupDiv>
    </form>
  );
};

const LandingSuccess: FC<LandingSuccessProps> = ({planColor}) => {
  return (
    <>
      <LandingFormInput id='share' type='text' value='https://grueplan.com/ijalfk' readOnly />
      <LandingFormButton type='button' backgroundColor={planColor}>
        Copy
      </LandingFormButton>
    </>
  );
};
