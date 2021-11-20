import {FC, useEffect, useState} from 'react';
import tw, {css, styled} from 'twin.macro';

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

const LandingFormGroupTitleDiv = tw.div`
  text-gray-700
  mb-3
`;

const LandingFormInputGroupDiv = tw.div`
  relative
  mb-3
`;

const LandingFormInputLabel = tw.label`
  absolute
  left-0
  z-0
  mt-2
  ml-3
  text-gray-400
`;

const inputLabelTransitionCss = css`
  & ~ label {
    ${tw`duration-300`}
  }

  &:focus-within ~ label,
  &:not(:placeholder-shown) ~ label {
    ${tw`transform scale-75 -translate-y-7 text-blue-500`}
  }

  &:focus-within ~ label {
    ${tw`text-blue-500`}
  }
`;

const LandingFormInput = styled.input`
  ${tw`
    relative
    z-10
    shadow
    appearance-none
    border
    rounded
    w-full
    py-2
    px-3
    bg-transparent
    text-gray-700
    leading-tight
    focus:outline-none
    focus:shadow-sm
    focus-within:border-blue-500
  `}

  ${inputLabelTransitionCss}
`;

const LandingFormTextArea = styled.textarea`
  ${tw`
    w-full
    px-3
    py-2
    text-gray-700
    border
    rounded-lg
    focus:outline-none
  `}

  ${inputLabelTransitionCss}
`;

const LandingFormNameColorGroupDiv = tw.div`
  flex
  flex-row
  mb-3
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
      <LandingFormGroupTitleDiv>What should we call the plan?</LandingFormGroupTitleDiv>
      <LandingFormNameColorGroupDiv>
        <LandingFormInputGroupDiv>
          <LandingFormInput id='title' type='text' placeholder=' ' />
          <LandingFormInputLabel htmlFor='title'>Title</LandingFormInputLabel>
        </LandingFormInputGroupDiv>

        <LandingFormInputGroupDiv>
          <input
            aria-label='color'
            type='color'
            value={planColor}
            onChange={event => setPlanColor(event.target.value)}
          />
        </LandingFormInputGroupDiv>
      </LandingFormNameColorGroupDiv>

      <LandingFormGroupTitleDiv>When is the plan?</LandingFormGroupTitleDiv>
      <LandingFormInputGroupDiv>
        <LandingFormInput id='start' type='text' placeholder=' ' />
        <LandingFormInputLabel htmlFor='start'>Start</LandingFormInputLabel>
      </LandingFormInputGroupDiv>
      <LandingFormInputGroupDiv>
        <LandingFormInput id='end' type='text' placeholder=' ' />
        <LandingFormInputLabel htmlFor='end'>End</LandingFormInputLabel>
      </LandingFormInputGroupDiv>

      <LandingFormGroupTitleDiv>What is the plan?</LandingFormGroupTitleDiv>
      <LandingFormInputGroupDiv>
        <LandingFormTextArea id='description' placeholder=' ' />
        <LandingFormInputLabel htmlFor='description'>Description</LandingFormInputLabel>
      </LandingFormInputGroupDiv>

      <LandingFormInputGroupDiv>
        <LandingFormButton type='button' backgroundColor={planColor} onClick={onNextStage}>
          Mark it!
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
