import {useState} from 'react';
import tw from 'twin.macro';

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
`;

const LandingH1 = tw.h1`
  mb-6
`;

const LandingFormInputGroupDiv = tw.div`
  flex
  flex-row
  justify-start
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

/*
 * Page.
 */

export default function Landing() {
  return (
    <BodyDiv>
      <LandingContainerDiv>
        <LandingDiv>
          <LandingH1>Welcome to Grueplan! Let's schedule an event.</LandingH1>
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
        <LandingFormLabel htmlFor='color'>Color</LandingFormLabel>
        <input id='color' type='color' value={color} onChange={event => setColor(event.target.value)} />
      </LandingFormInputGroupDiv>

      <LandingFormInputGroupDiv>
        <LandingFormLabel htmlFor='name'>Name</LandingFormLabel>
        <LandingFormInput id='name' type='text' placeholder='Name'></LandingFormInput>
      </LandingFormInputGroupDiv>

      <LandingFormInputGroupDiv>
        <LandingFormLabel htmlFor='description'>Description</LandingFormLabel>
        <LandingFormTextArea id='description' placeholder='Description'></LandingFormTextArea>
      </LandingFormInputGroupDiv>
    </form>
  );
}
