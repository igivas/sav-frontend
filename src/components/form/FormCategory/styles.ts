import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #999;
  font-size: 14px;
  padding: 0px 10px 8px 10px;

  hr {
    border-bottom: 2px solid #999;
  }

  @media (min-width: 0px) {
    margin-top: 8px;
  }

  @media (min-width: 900px) {
    margin-top: 8px;
  }

  @media (min-width: 1200px) {
    margin-top: 0px;
  }
`;
