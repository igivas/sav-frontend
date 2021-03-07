import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;

  button {
    padding: 0;
    border: none;
    background: none;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  svg {
    color: #999;
    transition: color 0.2s;
  }

  svg:hover {
    color: #333;
  }

  svg.active {
    color: #14a64f;
  }
`;
