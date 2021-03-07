import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import GlobalStyle from './styles/global';
import Routes from './routes';
import AppProvider from './contexts';
import Theme from './theme';

const App: React.FC = () => {
  return (
    <>
      <ChakraProvider theme={Theme}>
        <AppProvider>
          <BrowserRouter>
            <Routes />
            <GlobalStyle />
          </BrowserRouter>
        </AppProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
