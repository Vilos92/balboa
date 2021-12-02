import {FC} from 'react';
import tw from 'twin.macro';

/*
 * Types.
 */

interface ChromelessButtonProps extends React.HTMLProps<HTMLButtonElement> {}

/*
 * Styles.
 */

const StyledButton = tw.button`
  text-purple-500
  active:text-purple-400
  focus:text-purple-400
  hover:text-purple-400
`;

/*
 * Component.
 */

export const ChromelessButton: FC<ChromelessButtonProps> = ({children, onClick}) => (
  <StyledButton onClick={onClick}>{children}</StyledButton>
);
