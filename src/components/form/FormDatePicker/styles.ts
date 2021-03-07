import styled, { css } from 'styled-components';

interface IProps {
  error?: string | undefined;
}
export const Container = styled.div<IProps>`
  width: 100%;
  div.react-datepicker-wrapper {
    width: 100%;
  }
  input {
    height: 38px;
    width: 100%;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    color: #333;
    font-size: 14px;
    font-weight: 400;

    &::placeholder {
      color: #999;
    }

    &.disabled {
      background: #e3e3e3;
      color: #999;
    }

    &:focus-within {
      border-color: #999;
    }

    &:hover {
      border-color: #aaa;
    }

    ${({ error }) =>
      error &&
      css`
        border-color: #ff3030;
        &:focus-within {
          border-color: #ff3030;
        }

        &:hover {
          border-color: #ff3030;
        }
        &::placeholder {
          color: #ff3030;
        }
      `}
  }
`;

export const Error = styled.span`
  color: #ff3030;
  font-size: 13px;
  margin-top: 2px;
`;
