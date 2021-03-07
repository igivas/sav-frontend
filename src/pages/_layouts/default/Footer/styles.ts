import styled from 'styled-components';

export const Container = styled.div`
  footer {
    width: 100%;
    min-height: 160px;
    background: #fafafa;
    border-top-width: 6px;
    border-top-style: solid;
    border-top-color: #008127;
    div {
      text-align: center;
      font-size: 11px;
      padding: 0px 15px 10px;
      display: flex;
      flex-direction: column;
      strong {
        margin-bottom: 4px;
      }
    }
    img {
      max-width: 70px;
      margin-top: 15px;
      margin-bottom: 10px;
      margin-left: auto;
      margin-right: auto;
    }
    p {
      margin-bottom: 2px;
    }
  }
`;
