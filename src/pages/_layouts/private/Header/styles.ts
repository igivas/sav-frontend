import styled from 'styled-components';

export const Container = styled.header`
  width: 100%;
  height: 80px;
  background: #fff;

  -webkit-box-shadow: 1px 5px 9px -4px rgba(0, 0, 0, 0.71);
  -moz-box-shadow: 1px 5px 9px -4px rgba(0, 0, 0, 0.71);
  box-shadow: 1px 5px 9px -4px rgba(0, 0, 0, 0.71);

  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;

  padding: 8px 20px;

  color: #9b9b9b;
`;

export const UserInfo = styled.a`
  height: 100%;
  /* margin-left: auto; */
  /* border-bottom: 1px solid;
  border-bottom-color: #999; */
  min-width: 260px;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;

  color: #9b9b9b;

  div.dados {
    display: flex;
    flex-direction: column;
    margin-left: 8px;
  }

  strong {
    font-size: 13px;
  }

  span {
    margin-top: 4px;
    font-size: 13px;
    font-weight: 400;
  }
  cursor: pointer;



  @media (max-width: 600px){
    div {
      background: blue;
    }
  }


`;

export const UserImage = styled.div`
     .hide {
        display: none;
     }
`;

export const UserDetail = styled.div`
  .hide {
    display: none;
    position: fixed;
    bottom: 0;
    right: 15px;
    border: 3px solid #f1f1f1;
    z-index: 9;
  }

  .show {
    display: block;
  }
`;
