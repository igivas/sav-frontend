import React from 'react';
import Logo from '../../../../assets/sspds-pm.png';
import { Container, LogoContainer, WhiteContainer, LogoImage } from './styles';

interface IProps {
  title: string;
}

const Header: React.FC<IProps> = ({ title }) => {
  return (
    <Container>
      <LogoContainer>
        <a href="https://www.pm.ce.gov.br/">
          <LogoImage src={Logo} alt="logotipo" />
        </a>
      </LogoContainer>

      <WhiteContainer>
        <div
          id="title-page"
          className="justify-content-center align-items-center"
        >
          <h3>{title}</h3>
        </div>
      </WhiteContainer>
    </Container>
  );
};

export default Header;
