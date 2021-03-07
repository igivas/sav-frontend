import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  height: 35px;
  padding: 0px 8px 0px 4px;

  button {
    display: flex;
    align-items: center;
    border: none;
    background: none;
    svg {
      color: #999;
      &:hover {
        color: #333;
      }
    }
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 4px 8px;
  border: none;

  font-size: 14px;
  font-weight: 400;
  &::placeholder {
    color: #999;
  }
`;
