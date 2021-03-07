import React from 'react';
import { MdEdit, MdSearch, MdDashboard, MdCheck } from 'react-icons/md';
import {
  Accordion,
  Center,
  Flex,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import Logo from '../components/Logo';
import MenuItem from './Menu';
import MenuDropdown from './MenuDropdown';
import LogoCetic from '../../../../assets/logo-cetic-35px.png';
import { Container, HeaderMenu, Footer } from './styles';

interface ISideBarProps {
  activated: boolean;
  handleActiveSideBar(): void;
}

const consultasItems = [
  { label: 'Veiculos', to: '/veiculos/consulta' },
  { label: 'Marcas', to: '/marcas/consulta' },
  { label: 'Referências', to: '/referencias/consulta' },
];

const cadastrosItems = [
  { label: 'Veiculos', to: '/veiculos/cadastro' },
  { label: 'Pneu', to: '/pneus/cadastro' },
  /* { label: 'Situações', to: '/situacoes/cadastro' },
  { label: 'Movimentações', to: '/movimentacoes/cadastro' }, */
];

const SideBar: React.FC<ISideBarProps> = ({
  activated,
  handleActiveSideBar,
}) => {
  const bg = useColorModeValue('green.500', '#5b5b58');
  const color = useColorModeValue('gray.500', 'white');

  return (
    <Container activated={activated}>
      <HeaderMenu activated={activated}>
        <Logo activated={activated} />
      </HeaderMenu>

      <Flex
        bg={bg}
        color={color}
        direction="column"
        alignItems="initial"
        flex="1"
      >
        <Accordion allowToggle>
          <MenuItem
            to="/home"
            label="INICIAL"
            icon={MdDashboard}
            activated={activated}
          />

          <MenuDropdown
            label="Cadastros"
            icon={MdEdit}
            items={cadastrosItems}
            activated={activated}
            handleActiveSideBar={handleActiveSideBar}
          />

          <MenuDropdown
            label="Consultas"
            icon={MdSearch}
            items={consultasItems}
            activated={activated}
            handleActiveSideBar={handleActiveSideBar}
          />
        </Accordion>
      </Flex>
      <Footer activated={activated}>
        <Center w="100%">
          {activated && <Image src={LogoCetic} alt="logo cetic" />}
        </Center>
      </Footer>
    </Container>
  );
};

export default SideBar;
