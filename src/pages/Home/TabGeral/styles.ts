import styled from 'styled-components';

export const Container = styled.div`
  /* min-height: calc(100vh - 220px); */
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    width: calc(100% - 19px);

    font-size: 15px;
  }
`;

export const ContainerGrafics = styled.div`
  /* min-height: calc(100vh - 220px); */
  padding: 0px 20px 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    width: calc(100% - 19px);
  }
`;
