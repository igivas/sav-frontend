import styled from 'styled-components';

export const Container = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  > div.fade-box-login {
    background: #fff;
  }
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-radius: 4px;

  width: 100%;
  max-width: 350px;
  padding: 20px 40px;

  form {
    /* display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; */
    width: 100%;
    input {
      font-size: 14px;
    }
  }
`;

export const LogoContainer = styled.div`
  padding: 20px;
  img {
    width: 100%;
  }
  margin-bottom: 20px;
`;

export const Info = styled.div`
  font-size: 13px;
  color: #999;
  margin-top: 16px;
  text-align: center;
`;
