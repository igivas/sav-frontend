import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';

interface IProps {
  color: string;
}

export const Container = styled.div`
  display: flex;
  width: calc(100% / 3);
  flex-direction: column;
  padding: 10px;
  align-items: center;

  margin-bottom: 20px;

  @media (max-width: 1060px) {
    width: 50%;
  }

  @media (max-width: 750px) {
    width: 100%;
  }
`;

export const Header = styled.div<IProps>`
  width: 100%;
  min-height: 110px;
  ${(props) =>
    props.color &&
    css`
      background: ${props.color};
    `}
  padding: 16px 16px 0 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  color: #fff;
  font-weight: bold;

  div:first-child {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    div:first-child {
      font-size: 20px;
    }

    div + div {
      font-size: 28px;
    }
  }

  div#detalhes {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    font-size: 16px;
    margin-left: -16px;
    margin-right: -16px;
    height: 30px;
    color: #f6f6f6;

    ${(props) =>
      props.color &&
      css`
        background: ${darken(0.06, props.color)};
      `}

    cursor: pointer;

    transition: background 0.2s;

    &:hover {
      ${(props) =>
        props.color &&
        css`
          background: ${darken(0.1, props.color)};
        `}
      color: #fff;
    }

    &:active {
      ${(props) =>
        props.color &&
        css`
          background: ${darken(0.2, props.color)};
        `}
    }
  }
`;

export const Content = styled.div<IProps>`
  margin-top: 8px;
  width: 100%;
  background: #fff;

  border: 1px solid #ddd;
`;

export const Item = styled.div<IProps>`
  min-height: 70px;
  padding: 8px;
  display: flex;
  font-weight: 400;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #333;

  &:nth-child(even) {
    ${(props) =>
      props.color &&
      css`
        background: ${lighten(0.3, props.color)};
      `}
  }

  &:hover {
    font-weight: 700;
  }

  /* div + div {
    font-weight: 400;
  } */
`;
