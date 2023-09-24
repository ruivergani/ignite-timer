import styled from 'styled-components';

export const HomeContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  form{
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 3.5rem;
    
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  color: ${(props) => props.theme['gray-100']};
  font-size: 1.125rem;
  flex-wrap: wrap;
  font-weight: bold;
`;

export const CountdownContainer = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 10rem;
  line-height: 8rem;
  color: ${(props) => props.theme['gray-100']};
  display: flex;
  gap: 1rem;
  span{
    background: ${(props) => props.theme['gray-700']};
    padding: 2rem 1rem;
    border-radius: 8px;
  }
`;

export const Separator = styled.div`
  padding: 1.5rem 0;
  color: ${(props) => props.theme['green-500']};
  display: flex;
  overflow: hidden;
  justify-content: center;
`