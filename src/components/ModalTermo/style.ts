import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px 20px;
`;

export const SubTitle = styled.h2`
  text-align: center;
`;

export const Content = styled.p`
  text-align: justify;
`;

export const PdfLink = styled.a`
  margin-top: 16px;
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: black;
  svg {
    margin-bottom: 8px;
  }
`;
