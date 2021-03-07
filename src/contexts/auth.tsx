import React, { createContext, useCallback, useState, useContext } from 'react';
import { useToast } from '@chakra-ui/react';
import { decode } from 'jsonwebtoken';
import api from '../services/api';

interface IPerfil {
  id_perfil: number;
  id_sistema: number;
  descricao: string;
  limite: number;
  sigla: string;
}

interface ITokenPayload {
  iad: number;
  exp: string;
  sub: string;
}

interface IUser {
  id_usuario: number;
  nome: string;
  matricula: string;
  id_pf: number;
  militar: boolean;
  perfis: IPerfil[];
  pm_apelido?: string;
  pm_numero?: string;
  currentPerfil?: string;
  currentOpm?: { uni_codigo: string; uni_sigla: string };
  verSubunidade?: string;
  graduacao?: { gra_nome: string; gra_sigla: string; gra_codigo: number };
  opm?: { uni_nome: string; uni_sigla: string; uni_codigo: string };
  image?: { data: string; data_alteracao: string };
}

interface IAuthState {
  token: string;
  exp: string;
  user: IUser;
}

interface ISignInCredentials {
  matricula: string;
  senha: string;
}

interface IAuthContextData {
  user: IUser;
  exp: string;
  signIn(credentials: ISignInCredentials): Promise<void>;
  signOut(): void;
  updatePerfil(perfil: string): void;
  updateOpm(opm: { uni_sigla: string; uni_codigo: string }): void;
  updateVerSubunidades(opcao: string): void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const toast = useToast();
  const [data, setData] = useState<IAuthState>(() => {
    const token = sessionStorage.getItem('@pmce-cetic-sga:token');
    const exp = sessionStorage.getItem('@pmce-cetic-sga:token-exp');
    const user = sessionStorage.getItem('@pmce-cetic-sga:user');

    if (token && user && exp) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      const userObject = JSON.parse(user);
      const image = localStorage.getItem(
        `@pmce-cetic:${userObject.matricula}-image`,
      );
      if (image) {
        return {
          token,
          exp,
          user: { ...userObject, image: JSON.parse(image) },
        };
      }
      return { token, exp, user: userObject };
    }

    return {} as IAuthState;
  });

  const loadUserImage = useCallback(
    async (user: any, exp: string) => {
      const localImage = localStorage.getItem(
        `@pmce-cetic:${user.matricula}-image`,
      );
      let currentImage;
      if (localImage) {
        currentImage = JSON.parse(localImage);
        if (currentImage.data_alteracao === user.data_alteracao) {
          setData({ ...data, exp, user: { ...user, image: currentImage } });

          return;
        }
      }

      try {
        const responseImage = await api.get(
          `policiais/${user.matricula}/images`,
        );
        const image = responseImage.data;

        const updatedUser = {
          ...user,
          image: { data: image, data_alteracao: user.data_alteracao },
        };

        localStorage.setItem(
          `@pmce-cetic:${user.matricula}-image`,
          JSON.stringify({ data: image, data_alteracao: user.data_alteracao }),
        );

        setData({ ...data, exp, user: updatedUser });
      } catch (error) {
        toast({
          title: 'Ocorreu um erro.',
          description: 'Ocorreu um error ao carregar a imagem do usuário',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
    [toast, data],
  );

  const signIn = useCallback(
    async ({ matricula, senha }) => {
      try {
        const response = await api.post('sessions', { matricula, senha });
        const { token, user }: { token: string; user: IUser } = response.data;
        const userObject = {
          ...user,
          currentPerfil: user.perfis[0].descricao,
          currentOpm: {
            uni_codigo: user.opm ? user.opm.uni_codigo : '',
            uni_sigla: user.opm ? user.opm?.uni_sigla : '',
          },
          verSubunidade: '0',
        };

        const tokenPayload = decode(token);
        const { exp } = tokenPayload as ITokenPayload;

        sessionStorage.setItem('@pmce-cetic-sga:token', token);
        sessionStorage.setItem('@pmce-cetic-sga:token-exp', String(exp));
        sessionStorage.setItem(
          '@pmce-cetic-sga:user',
          JSON.stringify(userObject),
        );
        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({ token, exp, user: userObject });
        loadUserImage(userObject, exp);
      } catch (error) {
        toast({
          title: 'Ocorreu um erro.',
          description: error.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
    [loadUserImage, toast],
  );

  const updatePerfil = useCallback(
    (perfil: string) => {
      const userObject = { ...data.user, currentPerfil: perfil };
      setData({ ...data, user: userObject });
      sessionStorage.setItem(
        '@pmce-cetic-sga:user',
        JSON.stringify(userObject),
      );
    },
    [data],
  );

  const updateOpm = useCallback(
    (opm: { uni_codigo: string; uni_sigla: string }) => {
      const userObject = { ...data.user, currentOpm: opm };
      setData({ ...data, user: userObject });
      sessionStorage.setItem(
        '@pmce-cetic-sga:user',
        JSON.stringify(userObject),
      );
    },
    [data],
  );

  const updateVerSubunidades = useCallback(
    (opcao: string) => {
      const userObject = { ...data.user, verSubunidade: opcao };
      setData({ ...data, user: userObject });
      sessionStorage.setItem(
        '@pmce-cetic-sga:user',
        JSON.stringify(userObject),
      );
    },
    [data],
  );

  const signOut = useCallback(() => {
    sessionStorage.removeItem('@pmce-cetic-sga:token');
    sessionStorage.removeItem('@pmce-cetic-sga:token-exp');
    sessionStorage.removeItem('@pmce-cetic-sga:user');

    setData({} as IAuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        exp: data.exp,
        signIn,
        signOut,
        updatePerfil,
        updateOpm,
        updateVerSubunidades,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
