import React from 'react';
import { Switch } from 'react-router-dom';

// import NovaSituacao from 'pages/Situacoes/Novo';
import NovaMovimentacao from 'pages/Movimentacoes/Novo';
import NovaReferenciaPneu from 'pages/ReferenciaPneus/Novo';
import Home from '../pages/Home';
import VeiculoNovo from '../pages/Veiculos/Novo';
import Veiculos from '../pages/Veiculos';
import VeiculoEditar from '../pages/Veiculos/Editar';
import Marcas from '../pages/Marcas';
import Referencias from '../pages/ReferenciaPneus';
import Route from './Route';
import SignIn from '../pages/SignIn';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/home" component={Home} isPrivate />
      {/* <Route path="/situacoes/cadastro" component={NovaSituacao} isPrivate /> */}
      {/* <Route
        path="/movimentacoes/cadastro"
        component={NovaMovimentacao}
        isPrivate
      /> */}
      <Route path="/veiculos/cadastro" component={VeiculoNovo} isPrivate />
      <Route path="/marcas/consulta" component={Marcas} isPrivate />
      <Route path="/referencias/consulta" component={Referencias} isPrivate />
      <Route path="/veiculos/consulta" component={Veiculos} isPrivate />
      <Route
        path="/veiculos/editar/:id"
        component={VeiculoEditar}
        isPrivate
        exact
      />
      <Route
        path="/veiculos/movimentar/:id"
        component={NovaMovimentacao}
        isPrivate
      />
      <Route path="/pneus/cadastro" component={NovaReferenciaPneu} isPrivate />
      <Route component={SignIn} />
    </Switch>
  );
};

export default Routes;
