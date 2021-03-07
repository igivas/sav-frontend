import React from 'react';
import logoCetic from '../../../../assets/logo-cetic.png';
import { Container } from './styles';

const Footer: React.FC = () => {
  return (
    <Container>
      <footer>
        <div>
          <img id="logotipo" src={logoCetic} alt="logo cetic" />

          <strong>
            CÉLULA DE TECNOLOGIA DA INFORMAÇÃO E COMUNICAÇÃO DA PMCE
          </strong>
          <p>Av. Aguanambi, 2280 - Fátima - Fortaleza - CE</p>
          <p>
            Fone: 85 3101.3570 / 3101.3571 - E-mail: informatica@pm.ce.gov.br
          </p>
          <p>Horário de funcionamento</p>
          <p>De segunda a sexta de 8h às 12h e de 13h às 17h</p>
        </div>
      </footer>
    </Container>
  );
};

export default Footer;
