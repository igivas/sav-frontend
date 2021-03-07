import styled from 'styled-components';
import { darken } from 'polished';

export const ButtonContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  height: 35px;
  width: 180px;
  font-weight: 500;
  cursor: pointer;
  padding: 0px 8px 0px 4px;

  &.button.yellow {
    background: #ffbe38;
    transition: background 0.2s;

    &:hover {
      background: ${darken(0.1, '#ffbe38')};
    }

    &:active {
      background: ${darken(0.2, '#ffbe38')};
    }
  }

  &.button.green {
    background: #48b461;

    color: #fff;

    svg {
      color: #fff;
    }

    transition: background 0.2s;

    &:hover {
      background: ${darken(0.1, '#48b461')};
    }

    &:active {
      background: ${darken(0.2, '#48b461')};
    }
  }

  &.button.red {
    background: #e15361;

    color: #fff;

    svg {
      color: #fff;
    }

    transition: background 0.2s;

    &:hover {
      background: ${darken(0.1, '#E15361')};
    }

    &:active {
      background: ${darken(0.2, '#E15361')};
    }
  }

  svg {
    margin-left: 20px;

    &:hover {
    }
  }
`;
