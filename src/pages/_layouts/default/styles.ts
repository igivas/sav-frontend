import styled from 'styled-components';

export const Container = styled.div`
  min-height: calc(100% - 380px + 25px + 10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  flex: 1;

  @media (max-width: 580px) {
    min-height: calc(100% - 340px + 25px + 10px);
  }

  button {
    width: 100%;
  }

  form {
    > div {
      margin-bottom: 8px;
    }

    > button {
      margin-top: 8px;
    }
  }

  h3 {
    margin-bottom: 16px;
  }
`;

export const LogoContainer = styled.div`
  padding: 20px;
  img {
    width: 100%;
  }
  margin-bottom: 20px;
`;
