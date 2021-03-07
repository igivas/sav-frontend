import styled, { css } from 'styled-components';

interface IProps {
  size: number;
}

export const Container = styled.div<IProps>`
  ${(props) =>
    props.size &&
    css`
      height: ${`${props.size}px`};
      width: ${`${props.size}px`};
    `}

  border-radius: 50%;
  border: 2px solid #fff;

  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  background: #f5f5f5;
  padding: 2px;
  img {
    ${(props) =>
      props.size &&
      css`
        height: ${`${props.size * 1.1}px`};
      `}
  }
`;
