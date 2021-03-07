import styled from 'styled-components';

interface IProps {
  perPage: number;
}

export const Container = styled.div<IProps>`
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 1px;
    font-size: 14px;
  }

  table,
  th,
  td {
    border: 1px solid #999;
  }
  th {
    padding: 8px 8px;
    text-align: left;
  }

  td {
    padding: 8px 8px;
    text-align: left;
    font-size: 14px;
  }

  thead th {
    font-weight: 700;
    background-color: #fff;
  }

  thead th#action-header {
    text-align: center;
  }

  thead th div#header-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  tbody td#actions {
    div {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      button {
        background: none;
        border: none;
        display: flex;
        justify-content: center;
      }

      svg {
        color: #898c90;
        transition: color 0.2s;

        &:hover {
          color: #333;
        }
      }
    }
  }

  tbody tr {
    background-color: #fff;
  }

  tbody tr:nth-child(even) {
    background-color: #f5f5f5;
  }

  tbody tr:hover {
    background-color: #e5e5e5;
  }

  tbody tr td#row-loading {
    border: 1px solid #bbb;

    line-height: 100px;
    vertical-align: center;
  }
`;

export const FilterPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 8px;
  margin-left: -8px;
  margin-right: -8px;
`;

export const StatusBar = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  justify-content: space-between;
  align-items: center;
`;

export const TotalPanel = styled.div`
  font-weight: 400;
  font-size: 14px;
  margin-left: 4px;
`;
