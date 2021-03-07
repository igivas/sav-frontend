import Button from 'components/Button';
import React, { useCallback } from 'react';
import { Select } from '@chakra-ui/react';
import { useAuth } from '../../../../../contexts/auth';
import UserImage from '../UserImage';

import { Container, Header, Content, InfoUser } from './styles';

const DropDown: React.FC = () => {
  const { user, updatePerfil, signOut } = useAuth();

  const handleChangePerfil = (perfil: string): void => {
    updatePerfil(perfil);
  };

  const handleClickSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <Container>
      <Header>
        <UserImage size="lg" />
        <InfoUser>
          <p>{user.nome}</p>
          <p>{user.graduacao?.gra_nome}</p>
          <p>Matrícula: {user.matricula}</p>
          <p>OPM: {user.opm?.uni_sigla}</p>
        </InfoUser>
      </Header>
      <Content>
        <span>Perfil de acesso:</span>
        <Select
          value={user.currentPerfil}
          onChange={(e) => handleChangePerfil(e.target.value)}
        >
          {user.perfis.map((perfil, index) => (
            <option key={index} value={perfil.descricao}>
              {perfil.descricao}
            </option>
          ))}
        </Select>

        <Button
          colorScheme="red"
          size="sm"
          mt="2"
          variant="solid"
          onClick={() => handleClickSignOut()}
        >
          Sair
        </Button>
      </Content>
    </Container>
  );
};

export default DropDown;
