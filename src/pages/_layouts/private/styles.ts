import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
`;

export const MainContainer = styled.div`
  flex: 1;
`;

export const Body = styled.div`
  min-height: calc(100vh - 110px);
  padding: 30px 20px 20px;
  border-radius: 4px;
`;
