import React from 'react';
import { MdEdit, MdSearch, MdDashboard } from 'react-icons/md';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
} from '@chakra-ui/react';

import Logo from './Logo';
import MenuItem from './Menu';

interface ISideBarProps {
  isOpen: boolean;
  onClose(): void;
}

const SideBarMobile: React.FC<ISideBarProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer
      placement="left"
      onClose={onClose}
      isOpen={isOpen}
      size="xs"
      isFullHeight
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <HStack justifyContent="center">
              <DrawerCloseButton />
              <Logo />
            </HStack>
          </DrawerHeader>
          <DrawerBody bg="green.500" p={0}>
            <MenuItem
              to="/home"
              label="INICIAL"
              icon={MdDashboard}
              onClose={onClose}
            />
            <MenuItem
              to="/veiculos/cadastro"
              label="CADASTROS"
              icon={MdEdit}
              onClose={onClose}
            />
            
            <MenuItem
              to="/veiculos/consulta"
              label="CONSULTAS"
              icon={MdSearch}
              onClose={onClose}
            />
            
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default SideBarMobile;
