import {FC} from 'react';
import tw, {styled} from 'twin.macro';

/*
 * Types.
 */

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  backgroundColor?: string;
}

interface StyledColoredButtonProps {
  $backgroundColor?: string;
}

/*
 * Styles.
 */

const StyledColoredButton = styled.button.attrs<StyledColoredButtonProps>(({$backgroundColor}) => ({
  style: {backgroundColor: $backgroundColor}
}))<StyledColoredButtonProps>`
  ${tw`
    hover:brightness-150
    text-white
    font-bold
    py-2
    px-4
    rounded-full
    focus:outline-none
    focus:shadow
  `}

  text-shadow: 0 2px 4px rgba(0,0,0,0.10);
`;

/*
 * Component.
 */

export const Button: FC<ButtonProps> = ({children, backgroundColor, onClick, className}) => (
  <StyledColoredButton
    type='button'
    $backgroundColor={backgroundColor}
    onClick={onClick}
    className={className}
  >
    {children}
  </StyledColoredButton>
);
