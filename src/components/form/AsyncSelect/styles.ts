import styled from 'styled-components';

interface IProp {
  error?: string;
}

export const Container = styled.div<IProp>`
  width: 100%;
`;

export const Error = styled.span`
  color: #ff3030;
  font-size: 13px;
  margin-top: 2px;
`;
