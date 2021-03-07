import styled, { css } from 'styled-components';

interface IProps {
  error?: string | undefined;
  fontSize?: number;
}
export const Container = styled.div<IProps>`
  display: flex;
  flex-direction: column;
  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 38px;

    /* height: 38px;
    width: 100%; */

    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    color: #333;

    input {
      border-radius: 4px;
      padding: 4px 8px;
      border: none;
      height: 100%;

      width: 100%;
    }
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 45px;
      border: none;
      background: none;

      svg {
        color: #999;
      }
    }

    &:focus-within {
      border-color: #999;
    }

    &:hover {
      border-color: #999;
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
  }

  input:-internal-autofill-selected {
    background-color: #fff;
  }

  font-size: ${({ fontSize }) => fontSize && `${fontSize}px`};
  font-weight: 400;
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
