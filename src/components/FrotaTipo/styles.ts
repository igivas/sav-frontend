import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: calc(100% / 3);
  flex-direction: column;
  padding: 10px;
  align-items: center;

  margin-bottom: 20px;

  > h3 {
    font-size: 18px;
  }

  > div {
    margin-top: 16px;
  }

  @media (max-width: 1060px) {
    width: 50%;
  }

  @media (max-width: 750px) {
    width: 100%;
  }
`;
