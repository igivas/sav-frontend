import React, { createContext, useCallback, useContext } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import api from '../services/api';
import { useAuth } from './auth';

type ICreateDocumento = {
  body: {
    movimentacao?: {
      id_tipo_movimentacao: number;
      id_opm_origem: number;
      id_opm_destino: number;
      id_veiculo: string;
    };
  };
};

type IDocumentoContextData = {
  createDocumento(novoDocumento: ICreateDocumento): Promise<string | undefined>;
};

const DocumentoContext = createContext<IDocumentoContextData>(
  {} as IDocumentoContextData,
);

export const DocumentoProvider: React.FC = ({ children }) => {
  const toast = useToast();
  const { signOut } = useAuth();

  const createDocumento = useCallback(
    async ({ body }: ICreateDocumento): Promise<string | undefined> => {
      try {
        if (body.movimentacao) {
          const documento = await axios({
            baseURL: `${api.defaults.baseURL}/documentos`,
            headers: api.defaults.headers,
            method: 'POST',
            data: {
              body: {
                movimentacao: body.movimentacao,
              },
            },
            responseType: 'blob',
          });
          const urlDocument = URL.createObjectURL(documento.data);

          return urlDocument;
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) signOut();
          toast({
            title: 'Ocorreu um erro.',
            description:
              error.response.data.message ||
              'Ocorreu um erro ao cadastrar a movimentação.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }
        return undefined;
      }
    },
    [signOut, toast],
  );

  return (
    <DocumentoContext.Provider value={{ createDocumento }}>
      {children}
    </DocumentoContext.Provider>
  );
};

export function useDocumento(): IDocumentoContextData {
  const context = useContext(DocumentoContext);
  if (!context) {
    throw new Error(
      'useDocumento precisa estar dentro de DocumentoContext provider',
    );
  }
  return context;
}
