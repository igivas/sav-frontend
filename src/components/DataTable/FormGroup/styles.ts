import styled, { css } from 'styled-components';

interface IProps {
  cols?: [number, number, number];
}

export const Container = styled.div<IProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 4px 8px;

  label {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  ${(props) =>
    props.cols &&
    css`
      @media (min-width: 0px) {
        width: calc((100% / 12) * ${props.cols[2]});
      }

      @media (min-width: 900px) {
        width: calc((100% / 12) * ${props.cols[1]});
      }

      @media (min-width: 1200px) {
        width: calc((100% / 12) * ${props.cols[0]});
      }
    `}
`;
