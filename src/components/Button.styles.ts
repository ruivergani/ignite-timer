import styled from 'styled-components';

// Create a type in TypeScript 
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonContainerProps{
  variant: ButtonVariant; // must be created because needs styling for all color types
}

// Object for colors
const buttonVariants = {
  primary: 'purple',
  secondary: 'yellow',
  danger: 'red',
  success: 'green'
};

// Use <> to get properties
export const ButtonContainer = styled.button<ButtonContainerProps>`
  width:100px;
  height: 40px;
  background-color: ${props => props.theme.primary} // this is how you use the color from theme

  // Execute as function => send all props from ButtonContainer (in this case variant)
  /* ${props => {
    return `background-color: ${buttonVariants[props.variant]}`
  }} */
`;
