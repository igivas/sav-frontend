import styled from 'styled-components';

export const Container = styled.div`
  background-color: #fff;
  min-width: 280px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  right: 0;
  top: 82px;
`;

export const Header = styled.div`
  width: 100%;
  padding: 16px;
  background: #14a64f;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export const InfoUser = styled.div`
  font-size: 13px;
  color: #fff;
  padding: 8px 0px;
  text-align: center;
`;

export const Content = styled.div`
  padding: 16px;

  > span {
    color: #333;
    margin-bottom: 8px;
    font-size: 14px;
  }
`;
