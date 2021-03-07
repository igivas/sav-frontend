import styled, { css } from 'styled-components';

interface IProp {
  error?: string;
  touched?: boolean;
}

export const Container = styled.select<IProp>`
  width: 100%;
  height: 38px;
  padding: 0.375rem 0.75rem;
  font-size: 14px;
  line-height: 1.5;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  color: #333;
  /* -webkit-appearance: none; */
  &.disabled {
    background: #ddd;
    color: #666;
  }

  ${({ error, touched }) =>
    error &&
    touched &&
    css`
      border-color: #ff3030;
    `}
`;

export const Error = styled.span`
  color: #ff3030;
  font-size: 13px;
  margin-top: 2px;
`;
