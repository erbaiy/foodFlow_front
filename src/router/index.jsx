import React, { Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Loader from '../components/Loader';
import { routes } from './routes';

const lazyLoad = (Component) => {
  const LazyComponent = (props) => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
  LazyComponent.displayName = `LazyLoad(${Component.displayName || Component.name || 'Component'})`;
  return LazyComponent;
};

const applyLayout = (route) => {
  const Layout = route.layout || React.Fragment;
  const RouteComponent = route.element ? lazyLoad(route.element) : Outlet;

  const LayoutWrapper = (props) => (
    <Layout>
      <RouteComponent {...props} />
    </Layout>
  );
  LayoutWrapper.displayName = `LayoutWrapper(${Layout.displayName || Layout.name || 'Layout'})`;

  return {
    ...route,
    element: <LayoutWrapper />,
    children: route.children ? route.children.map(applyLayout) : undefined,
  };
};

const router = createBrowserRouter(routes.map(applyLayout));

export default router;