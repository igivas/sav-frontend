import React, { useState, useCallback } from 'react';
import { useDisclosure, useMediaQuery, Flex } from '@chakra-ui/react';

import Header from './Header';
import { Body } from './styles';

import SideBar from './SideBar';
import SideBarMobile from './SideBarMobile';

const SideBarDefault: React.FC = ({ children }) => {
  const [activated, setActivated] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerCelular] = useMediaQuery(['(min-width: 960px)']);

  const handleActiveSideBar = useCallback(() => {
    isLargerCelular ? setActivated(!activated) : onOpen();
  }, [activated, onOpen, isLargerCelular]);

  return (
    <Flex
      minH="100vh"
      direction="row"
      width="100%"
      background={{
        base: '#fdfdfd',
        sm: '#fdfdfd',
        md: '#fdfdfd',
        lg: '#f6f6f6',
      }}
    >
      {isLargerCelular ? (
        <SideBar
          activated={activated}
          handleActiveSideBar={handleActiveSideBar}
        />
      ) : (
        <SideBarMobile isOpen={isOpen} onClose={onClose} />
      )}

      <Flex flex="1" direction="column">
        <Header handleActiveSideBar={handleActiveSideBar} />
        <Body>{children}</Body>
      </Flex>
    </Flex>
  );
};

export default SideBarDefault;
