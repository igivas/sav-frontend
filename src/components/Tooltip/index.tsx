import React from 'react';
import { Container } from './styles';

type TooltipProps = {
  text: string;
  position: 'left' | 'right' | 'top' | 'bottom';
};

const Tooltip: React.FC<TooltipProps> = ({ text, position, children }) => {
  return (
    <Container position={position}>
      <div className="tooltip">
        {children}
        <span className="tooltiptext">{text}</span>
      </div>
    </Container>
  );
};

export default Tooltip;
