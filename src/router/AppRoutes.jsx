import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import Loader from '../components/Loader';
import AuthGuard from '../guard/AuthGuard';

const AppRoutes = () => {
  const renderRoutes = (routesArray) => {
    return routesArray.map((route, index) => {
      const Element = route.element;
      
      return (
        <Route
          key={index}
          element={
            <Suspense fallback={<Loader />}>
              <Element />
            </Suspense>
          }
        >
          {route.children?.map((childRoute, childIndex) => {
            // Get required role from route object or parent layout, if specified
            const requiredRole = childRoute.requiredRole || (typeof Element === 'function' && Element.name.includes('userRole') ? 
              route.element.props?.userRole : null);
            
            const ChildElement = childRoute.element;
            
            // Wrap child routes with AuthGuard when needed
            const ProtectedElement = childRoute.protected ? (
              <AuthGuard requiredRole={requiredRole}>
                <ChildElement />
              </AuthGuard>
            ) : (
              <ChildElement />
            );
            
            return (
              <Route
                key={childIndex}
                path={childRoute.path}
                element={
                  <Suspense fallback={<Loader />}>
                    {ProtectedElement}
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      );
    });
  };

  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default AppRoutes;













// import React, { Suspense } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import { routes } from './routes';
// import Loader from '../components/Loader';

// const AppRoutes = () => {
//   const renderRoutes = (routesArray) => {
//     return routesArray.map((route, index) => {
//       const Element = route.element;
      
//       return (
//         <Route
//           key={index}
//           element={
//             <Suspense fallback={<Loader />}>
//               <Element />
//             </Suspense>
//           }
//         >
//           {route.children?.map((childRoute, childIndex) => (
//             <Route
//               key={childIndex}
//               path={childRoute.path}
//               element={
//                 <Suspense fallback={<Loader />}>
//                   <childRoute.element />
//                 </Suspense>
//               }
//             />
//           ))}
//         </Route>
//       );
//     });
//   };

//   return <Routes>{renderRoutes(routes)}</Routes>;
// };

// export default AppRoutes;