import styled, { css } from 'styled-components';

interface ContainerProps {
  position: 'left' | 'right' | 'top' | 'bottom';
}

export const Container = styled.div<ContainerProps>`
  .tooltip {
    position: relative;
    display: inline-block;


    padding: 0 8px; /* If you want dots under the hoverable text */
  }

  /* Tooltip text */
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 100px;
    background-color: #333;
    color: #fff;
    text-align: center;
    padding: 4px 0;
    border-radius: 4px;
    font-size: 12px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;

    opacity: 0;
  transition: opacity 0.4s;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }

  ${(props) =>
    props.position === 'left' &&
    css`
      .tooltip .tooltiptext {
        top: -5px;
        right: 105%;
      }
    `}

  ${(props) =>
    props.position === 'right' &&
    css`
      .tooltip .tooltiptext {
        top: -5px;
        left: 105%;
      }
    `}

    ${(props) =>
      props.position === 'top' &&
      css`
        .tooltip .tooltiptext {
          width: 100px;
          bottom: 100%;
          left: 50%;
          margin-left: -50px; /* Use half of the width (120/2 = 60), to center the tooltip */
        }
      `}

      ${(props) =>
        props.position === 'bottom' &&
        css`
          .tooltip .tooltiptext {
            width: 100px;
            top: 100%;
            left: 50%;

            margin-left: -50px;
          }
        `}
`;
