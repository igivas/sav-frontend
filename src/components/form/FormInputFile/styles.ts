import styled, { css } from 'styled-components';

interface IProps {
  error?: string | undefined;
  fontSize?: number;
}
export const Input = styled.input<IProps>`
  height: 38px;
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #333;

  font-size: ${({ fontSize }) => fontSize && `${fontSize}px`};
  font-weight: 400;

  &:focus-within {
    border-color: #999;
  }

  &:hover {
    border-color: #aaa;
  }
  &::placeholder {
    color: #999;
  }

  &.disabled {
    background: #e3e3e3;
    color: #333;
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
`;

export const Error = styled.span`
  color: #ff3030;
  font-size: 13px;
  margin-top: 2px;
`;

// ${(props) =>
//   props.isValid === true &&
//   css`
//     border-color: #32cd32;
//   `}

// ${(props) =>
//   props.isValid === false &&
//   css`
//     border-color: #ff3030;
//   `}
