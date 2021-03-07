import React from 'react';
import {
  Route as ReactDomRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import DefaultLayout from '../pages/_layouts/default';
import PrivateLayout from '../pages/_layouts/private';

interface IRouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  isPublicPrivate?: boolean;
  component?: any;
}

const Route: React.FC<IRouteProps> = (
  { isPrivate = false, isPublicPrivate = false, component: Component },
  ...rest
) => {
  const { user } = useAuth();

  if (!user && isPrivate) {
    return <Redirect to="/" />;
  }

  if (!!user && !isPrivate && !isPublicPrivate) {
    return <Redirect to="/home" />;
  }

  if (!!user && !Component) {
    return <Redirect to="/home" />;
  }

  if (!user && !Component) {
    return <Redirect to="/" />;
  }

  const Layout = !!user && isPrivate ? PrivateLayout : DefaultLayout;
  return (
    <ReactDomRoute
      {...rest}
      render={(props) => (
        <Layout>
          <Component />
        </Layout>
      )}
    />
  );
};

export default Route;
