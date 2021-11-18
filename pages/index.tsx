import tw from 'twin.macro';

/*
 * Styles.
 */

const BodyDiv = tw.div`
  bg-gray-500
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
  rounded-sm
  shadow-md
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

/*
 * Page Component.
 */

export default function Landing() {
  return (
    <BodyDiv>
      <LandingContainerDiv>
        <LandingDiv>
          Welcome to Grueplan! Let's schedule an event.
          <LandingForm />
        </LandingDiv>
      </LandingContainerDiv>
    </BodyDiv>
  );
}

/*
 * Sub-Components.
 */

function LandingForm() {
  return (
    <form>
      <LandingFormLabel htmlFor='name'>Name</LandingFormLabel>
      <LandingFormInput id='name' type='text' placeholder='Name'></LandingFormInput>
    </form>
  );
}
