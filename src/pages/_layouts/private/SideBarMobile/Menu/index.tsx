import React from 'react';
import { Box, HStack, Text, Tooltip } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

import { IconBaseProps } from 'react-icons';

interface IProps {
  label: string;
  icon: React.ComponentType<IconBaseProps>;
  to?: string;
  toExternal?: string;
  onClose(): void;
}

const Menu: React.FC<IProps> = ({
  label,
  to,
  icon: Icon,
  onClose,
  toExternal,
}) => {
  const history = useHistory();
  return (
    <Tooltip hasArrow label={label} placement="right">
      <Box
        as="button"
        background="green.500"
        transition="all 0.3s"
        color="white"
        _hover={{ background: 'white', color: 'black' }}
        height="70px"
        w="100%"
        px="16px"
        onClick={() => {
          if (to) {
            history.push(to);
          }
          if (toExternal) {
            window.open(toExternal, '_blank');
          }
          onClose();
        }}
      >
        <HStack alignContent="center">
          <Icon size={25} />

          <Text fontSize="md" height={25}>
            {label}
          </Text>
        </HStack>
      </Box>
    </Tooltip>
  );
};

export default Menu;
