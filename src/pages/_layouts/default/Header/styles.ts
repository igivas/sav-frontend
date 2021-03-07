import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(to right, #00621d, #0ba33d 90%);
  margin-bottom: 25px;

  div#link-actions {
    position: absolute;
    right: 55px;
    top: 25px;
  }
  @media (max-width: 580px) {
    height: 100px;
    margin-bottom: 45px;

    div#link-actions {
      position: absolute;
      right: 10px;
      top: 2px;
    }
  }
`;

export const LogoContainer = styled.div`
  height: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 70%;
  margin: 0 auto;

  a {
    width: 100%;
  }
`;

export const WhiteContainer = styled.div`
  width: 70%;
  height: 50px;
  position: absolute;
  top: 135px;
  left: 15%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
  padding-right: 50px;
  background: white;
  text-align: center;
  font-size: 12px;
  border-bottom-width: 6px;
  border-bottom-style: solid;
  border-bottom-color: coral;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px !important;

  div#title-page {
    width: 100%;
    margin-left: 15px;
    h3 {
      margin-bottom: 0px;
      font-weight: 400;
      font-size: 20px;

      @media (max-width: 620px) {
        font-size: 16px;
        line-height: 16px;
      }
    }
  }

  @media (max-width: 580px) {
    height: 45px;
    width: 100%;
    top: 100px;
    left: 0px;
    h3 {
      font-size: 14px;
      font-weight: 400;
    }
  }
`;

export const LogoImage = styled.img`
  max-height: 100px;
  max-width: 100%;
`;
