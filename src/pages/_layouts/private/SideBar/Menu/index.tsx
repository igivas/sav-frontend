import React from 'react';
import { Box, HStack, Text, Tooltip } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

import { IconBaseProps } from 'react-icons';

interface IProps {
  label: string;
  activated: boolean;
  icon: React.ComponentType<IconBaseProps>;
  to?: string;
  toExternal?: string;
}

const Menu: React.FC<IProps> = ({
  label,
  activated,
  to,
  icon: Icon,
  toExternal,
}) => {
  const history = useHistory();
  return (
    <Tooltip hasArrow label={label} isDisabled={activated} placement="right">
      <Box
        as="button"
        background="green.500"
        transition="all 0.3s"
        color="white"
        _hover={{ background: 'white', color: 'black' }}
        height="70px"
        w="100%"
        px={`${activated ? '24px' : '16px'}`}
        onClick={() => {
          if (to) {
            history.push(to);
          }
          if (toExternal) {
            window.open(toExternal, '_blank');
          }
        }}
      >
        <HStack alignContent="center" justifyContent="flex-start">
          <Icon size={25} />

          {activated && (
            <Text fontSize="md" visibility="visible" pt="3px">
              {label}
            </Text>
          )}
        </HStack>
      </Box>
    </Tooltip>
  );
};

export default Menu;
