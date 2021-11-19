import {useState} from 'react';
import tw, {styled} from 'twin.macro';

/*
 * Types.
 */

interface LandingFormSubmitButtonProps {
  color: string;
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
  md:w-6/12
`;

const LandingH1 = tw.h1`
  text-2xl
  text-center
  mb-6
`;

const LandingH2 = tw.h2`
  text-lg
  text-left
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

const LandingFormSubmitButton = styled.button<LandingFormSubmitButtonProps>`
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

  ${({color}) => `background-color: ${color}`}
`;

/*
 * Page.
 */

export default function Landing() {
  return (
    <BodyDiv>
      <LandingContainerDiv>
        <LandingDiv>
          <LandingH1>Welcome to Grueplan!</LandingH1>
          <LandingH2>Let's create an event.</LandingH2>
          <LandingForm />
        </LandingDiv>
      </LandingContainerDiv>
    </BodyDiv>
  );
}

/*
 * Components.
 */

function LandingForm() {
  const randColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  const [color, setColor] = useState(randColor);

  return (
    <form>
      <LandingFormInputGroupDiv>
        <LandingFormLabel htmlFor='name'>Name</LandingFormLabel>
        <LandingFormInput id='name' type='text' placeholder='Name'></LandingFormInput>
      </LandingFormInputGroupDiv>

      <LandingFormInputGroupDiv>
        <LandingFormLabel htmlFor='color'>Color</LandingFormLabel>
        <input id='color' type='color' value={color} onChange={event => setColor(event.target.value)} />
      </LandingFormInputGroupDiv>

      <LandingFormInputGroupDiv>
        <LandingFormLabel htmlFor='description'>Description</LandingFormLabel>
        <LandingFormTextArea id='description' placeholder='Description'></LandingFormTextArea>
      </LandingFormInputGroupDiv>

      <LandingFormInputGroupDiv>
        <LandingFormSubmitButton type='button' color={color}>
          Create
        </LandingFormSubmitButton>
      </LandingFormInputGroupDiv>
    </form>
  );
}
