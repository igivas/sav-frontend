import styled, { css } from 'styled-components';

interface IProps {
  activated: boolean;
}

export const Container = styled.div<IProps>`
  display: flex;
  flex-direction: column;
  width: 60px;
  min-height: 100vh;
  -webkit-box-shadow: 4px 0px 9px -4px rgba(0, 0, 0, 0.71);
  -moz-box-shadow: 4px 0px 9px -4px rgba(0, 0, 0, 0.71);
  box-shadow: 4px 0px 9px -4px rgba(0, 0, 0, 0.71);
  transition: width 0.6s;
  ${(props) =>
    props.activated &&
    css`
      width: 250px;
    `}
`;

export const HeaderMenu = styled.div<IProps>`
  display: block;
  height: 80px;
  width: 100%;
  background: #fff;
  font-size: 22px;
  font-weight: 800;
  transition: visibility 0.5s;
  div {
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 45px;
      margin-left: 20px;
    }
  }
`;

export const Footer = styled.div<IProps>`
  background: #1a8d4c;
  height: 120px;
  padding: 24px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: padding 0.5s;
  ${(props) =>
    props.activated &&
    css`
      padding: 40px 40px 20px;
      flex-direction: row;
    `}
  button {
    background: none;
    border: none;
  }
  button + button {
    margin-top: 8px;
  }
  svg {
    color: #999;
    transition: color 0.2s;
    &:hover {
      color: #fff;
    }
  }
`;
