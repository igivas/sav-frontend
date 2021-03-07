import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  font-size: 20px;

  div + div {
    margin-left: 10px;
    width: 100%;
    text-align: center;

    span {
      margin-left: 5px;
    }
  }
`;

export const Icon = styled.div`
  display: flex;
  flex-direction: column;

  height: 50px;
  width: 55px;
  border-radius: 4px;

  align-items: center;

  ${(props) =>
    props.color &&
    css`
      background: ${props.color};
    `}

  svg {
    margin-left: auto;
  }
`;
