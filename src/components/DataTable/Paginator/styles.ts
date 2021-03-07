import styled from 'styled-components';

export const Container = styled.div`
  margin-right: 4px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  button {
    height: 35px;
    align-self: center;
    background: none;
    padding: 6px 6px;
    font-size: 12px;
    border: 1px solid #999;

    justify-content: center;
    align-items: center;

    transition: background 0.1s;

    &.active {
      background: #14a64f;
      border: 1px solid #14a64f;
      color: #fff;
      font-weight: 700;
    }

    &:hover:not(.active) {
      background: #fff;
    }

    &:active {
      background: #ccc;
    }
  }

  .page-number {
    border-left: none;

    border-right: none;
    width: 30px;
  }

  button.page-number + button.page-number {
    border-left: 1px solid #999;
  }

  #previous {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    /* border-right: none; */
  }

  #next {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    /* border-left: none; */
  }
`;
