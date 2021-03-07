import React from 'react';

import { VeiculoProvider } from './VeiculoContext';
import { SituacaoProvider } from './SituacaoContext';
import { MovimentacaoProvider } from './MovimentacaoContext';
import { AuthProvider } from './auth';
import { DocumentoProvider } from './DocumentoContext';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <VeiculoProvider>
      <DocumentoProvider>
        <SituacaoProvider>
          <MovimentacaoProvider>{children}</MovimentacaoProvider>
        </SituacaoProvider>
      </DocumentoProvider>
    </VeiculoProvider>
  </AuthProvider>
);

export default AppProvider;
