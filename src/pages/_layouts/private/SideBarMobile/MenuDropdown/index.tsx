import React from 'react';
import {
  Box,
  HStack,
  Text,
  Tooltip,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { IconBaseProps } from 'react-icons';

type MenuItem = {
  label: string;
  to?: string;
  toExternal?: string;
};

interface IProps {
  label: string;
  activated: boolean;
  handleActiveSideBar(): void;
  icon: React.ComponentType<IconBaseProps>;
  items: MenuItem[];
}

const Menu: React.FC<IProps> = ({
  label,
  activated,
  icon: Icon,
  items,
  handleActiveSideBar,
}) => {
  const history = useHistory();
  return (
    <Tooltip hasArrow label={label} isDisabled={activated} placement="right">
      <AccordionItem border="none">
        {({ isExpanded }) => (
          <>
            <AccordionButton
              height="70px"
              px={`${activated ? '24px' : '16px'}`}
              onRender={() => console.log('teste')}
              _focus={{ boxShadow: 'none' }}
              _hover={{ background: 'white', color: 'black' }}
              _expanded={
                activated
                  ? { background: 'white', color: 'black' }
                  : { background: 'green' }
              }
              onClick={(e) => {
                if (!activated) {
                  handleActiveSideBar();
                }
              }}
            >
              <Box flex="1" textAlign="left">
                <HStack>
                  <Icon size={25} />
                  {activated && <Text>{label.toLocaleUpperCase()}</Text>}
                </HStack>
              </Box>
              {activated && <AccordionIcon />}
            </AccordionButton>

            <AccordionPanel
              pb={0}
              p={0}
              style={
                !activated || !isExpanded
                  ? {
                      overflow: 'hidden',
                      display: 'none',
                      opacity: 0,
                      height: '0px',
                    }
                  : {}
              }
            >
              {items.map((item) => (
                <Box
                  key={item.label}
                  as="button"
                  background="gray.100"
                  _hover={{ background: 'gray.300', color: 'black' }}
                  transition="all 0.3s"
                  color="black"
                  height="50px"
                  w="100%"
                  px={`${activated ? '24px' : '16px'}`}
                  onClick={() =>
                    item.toExternal
                      ? window.open(item.toExternal, '_blank')
                      : history.push(`${item.to}`)
                  }
                >
                  <HStack alignContent="center">
                    <Text fontSize="md" height={25}>
                      {item.label}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Tooltip>
  );
};

export default Menu;
