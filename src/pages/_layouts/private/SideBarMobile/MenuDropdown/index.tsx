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
  Accordion,
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
  icon: React.ComponentType<IconBaseProps>;
  items: MenuItem[];
}

const Menu: React.FC<IProps> = ({ label, icon: Icon, items }) => {
  const history = useHistory();
  return (
    <Tooltip hasArrow label={label} placement="right">
      <Accordion allowToggle>
        <AccordionItem border="none">
          {({ isExpanded }) => (
            <>
              <AccordionButton
                height="70px"
                px="24px"
                bg="green.500"
                _expanded={{ bg: 'white' }}
                _focus={{ boxShadow: 'none' }}
                // _hover={{ background: 'white', color: 'black' }}
              >
                <Box
                  flex="1"
                  textAlign="left"
                  color={isExpanded ? 'black' : 'white'}
                  transition="all 0.3s"
                >
                  <HStack>
                    <Icon size={25} color={isExpanded ? '#000' : '#fff'} />
                    <Text>{label.toLocaleUpperCase()}</Text>
                  </HStack>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={0} p={0}>
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
                    px="24px"
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
      </Accordion>
    </Tooltip>
  );
};

export default Menu;