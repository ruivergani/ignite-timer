import styled from 'styled-components';

export const HistoryContainer = styled.main`
  flex: 1;
  padding: 3.5rem;
  display: flex;
  flex-direction: column;
  h1{
    color: ${(props) => props.theme['gray-100']};
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 160%; 
  }
`;
export const HistoryList = styled.div`
  margin: 2rem 0px;
  flex: 1;
  overflow: auto;
  table{
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
    th{
      background-color: ${(props) => props.theme['gray-600']};
      padding: 1rem;
      text-align: left;
      color: ${(props) => props.theme['gray-100']};
      font-size: 0.875rem;
      line-height: 1.6;
      &:first-child{
        border-top-left-radius: 8px;
        padding-left: 1.5rem;
      }
      &:last-child{
        border-top-right-radius: 8px;
        padding-right: 1.5rem;
      }
    }
    td{
      background-color: ${(props) => props.theme['gray-700']};
      border-top: 4px solid ${(props) => props.theme['gray-800']};
      padding: 1rem;
      line-height: 1.6;
      font-size: 0.875rem;
      &:first-child{
        padding-left: 1.5rem;
        width: 50%;
      }
      &:last-child{
        padding-right: 1.5rem;
      }
    }

  }
`;

// Object to map colors to rgb
const STATUS_COLORS = {
  yellow: 'yellow-500',
  red: 'red-500',
  green: 'green-500'
} as const; // exclusivamente as 3 acima

// Create props for status
interface StatusProps{
  statusColor: keyof typeof STATUS_COLORS; // cores disponiveis sao as keys do tipo STATUS_COLORS object
}

export const Status = styled.span<StatusProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &::before{
    content: "";
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: ${(props) => props.theme[STATUS_COLORS[props.statusColor]]}
  }
`;
