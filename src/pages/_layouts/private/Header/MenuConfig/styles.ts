import styled from 'styled-components';

export const Content = styled.div`
  display: none;
  position: absolute;

  background-color: #fff;
  min-width: 280px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  right: 0;
  top: 82px;

  &.active {
    display: block;
    text-align: 'center';

    /* button {
      margin-top: 8px;
      height: 35px;

      min-width: 50%;
    } */
  }
`;

export const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
