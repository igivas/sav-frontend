import styled from 'styled-components';

export const Container = styled.div`
  min-height: calc(100vh - 182px);
  nav {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #ccc;
    margin-bottom: 20px;
    margin-left: -10px;
    margin-right: -10px;

    a:first-child {
      margin-left: 20px;
    }

    a {
      display: inline-block;
      text-decoration: none;
      height: 35px;
      padding: 8px 15px;
      border: 1px solid #ddd;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      color: #666;

      border-bottom: none;

      &.active {
        background: #ddd;
        border-color: #ddd;
        color: #373a3c;
        font-weight: 700;
      }
    }

    a + a {
      margin-left: 6px;
    }
  }

  div .tab-pane {
    display: none;
    min-height: calc(100vh - 238px);
    /* position: relative; */

    &.active {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
`;
