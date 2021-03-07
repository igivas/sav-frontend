import React from 'react';

import { Button, ButtonProps } from '@chakra-ui/react';

const AccordionComponent: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button {...rest} borderRadius="4px">
      {children}
    </Button>
  );
};

export default AccordionComponent;
