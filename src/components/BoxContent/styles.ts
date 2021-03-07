import styled from 'styled-components';

export const Container = styled.div`
  max-height: calc(100vh - 160px);
  min-height: calc(100vh - 160px);
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;

  background: #fbfbfd;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #999;
  }
`;
