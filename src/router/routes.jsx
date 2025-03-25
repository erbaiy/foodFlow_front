import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const Register = lazy(() => import('../pages/auth/Register'));
const RegisterClient = lazy(() => import('../pages/auth/RegisterClient'));
const RegisterRestaurant = lazy(() => import('../pages/auth/RegisterRestaurant'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));
const VerifyOtp = lazy(() => import('../pages/auth/VerifyOtp'));
const Logout = lazy(() => import('../pages/auth/Logout'));
const RestaurantManagerDashboard = lazy(() => import('../pages/restaurantManager/Dashboard'));
const SuperAdminDashboard = lazy(() => import('../pages/superAdmin/Dashboard'));
const MainLayout = lazy(() => import('../components/layout/Interface/MainLayout'));
const DefaultLayout = lazy(() => import('../components/layout/Dashboard/DefaultLayout'));
const BlankLayout = lazy(() => import('../components/layout/Dashboard/BlankLayout'));
const Login = lazy(() => import('../pages/auth/Login'));
const ManageRestaurants = lazy(() => import('../pages/superAdmin/RestaurantManagement/ManageRestaurants'));
const RestaurantDetails = lazy(() => import('../pages/superAdmin/RestaurantManagement/RestaurantDetails'));
const AddRestaurant = lazy(() => import('../pages/superAdmin/RestaurantManagement/AddRestaurant'));
const ApproveRestaurants = lazy(() => import('../pages/superAdmin/RestaurantManagement/ApproveRestaurants'));
const AddMenuItem = lazy(() => import('../pages/superAdmin/RestaurantManagement/AddMenuItem'));
const RestaurantManagerDetails = lazy(() => import('../pages/restaurantManager/RestaurantManagement/RestaurantDetails'));
const AddMenuItemRestaurantManager = lazy(() => import('../pages/restaurantManager/MenuManagement/AddMenuItem'));
const ViewOrders = lazy(() => import('../pages/restaurantManager/OrderManagement/ViewOrders'));
const ListDeliveryDriverForRestManager = lazy(() => import('../pages/restaurantManager/OrderManagement/ListDeliveryDriverForRestManager'));
const Restaurants = lazy(() => import('../pages/Restaurants'));
const RestaurantMenuDetails = lazy(() => import('../pages/RestaurantDetails'));
const EditMenuItem = lazy(() => import('../pages/restaurantManager/MenuManagement/EditMenuItem'));
const MenuDetails = lazy(() => import('../pages/MenuDetails'));
const Cart = lazy(() => import('../pages/Cart'));
const OrderTracking = lazy(() => import('../pages/OrderTracking'));
const OrderList = lazy(() => import('../pages/OrderList'));
const DeliveryConfirmation = lazy(() => import('../pages/DeliveryConfirmation'));
const ListDeliveryDrivers = lazy(() => import('../pages/superAdmin/DeliveryDriverManagement/ListDeliveryDrivers'));
const AddDeliveryDriver = lazy(() => import('../pages/superAdmin/DeliveryDriverManagement/AddDeliveryDriver'));
const EditDeliveryDriver = lazy(() => import('../pages/superAdmin/DeliveryDriverManagement/EditDeliveryDriver'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/resetPassword'));
const DriverDeliveryOrders = lazy(() => import('../pages/driver/ViewAsignOrders'));
const HistoryDriver = lazy(() => import('../pages/driver/HistoryDriver'));




import NotFound from './../pages/404';
// import { Profile } from './../pages/profile';

export const routes = [
  {
    element: MainLayout,
    children: [
      { path: '/', element: Home, protected: false },
      { path: '/restaurants', element: Restaurants, protected: true },
      { path: '/restaurant/:id', element: RestaurantMenuDetails, protected: true },
      { path: '/menu-details/:id', element: MenuDetails, protected: true },
      { path: '/cart', element: Cart, protected: true },
      { path: '/order-tracking/:orderId', element: OrderTracking, protected: true },  
      { path: '/order-list', element: OrderList, protected: true },  
      { path: '/delivery-confirmation', element: DeliveryConfirmation, protected: true },
      // { path: '/users/profile', element: Profile, protected: true },
      { path: '/restaurant-details/:id', element: RestaurantMenuDetails, protected: true },

    ],
  },
  {
    element: (props) => <DefaultLayout {...props} userRole="livreur" />,
    children: [
      
      { 
        path: '/dashboard/driver/DriverDeliveryOrders', 
        element: DriverDeliveryOrders, 
        protected: true,
        requiredRole: 'livreur' 
      },
      { 
        path: '/dashboard/driver/HistoryDriver', 
        element: HistoryDriver, 
        protected: true,
        requiredRole: 'livreur' 
      },
    ],
  },
  {
    element: (props) => <DefaultLayout {...props} userRole="gestionnaire" />,
    children: [
      { 
        path: '/dashboard/restaurant-manager/analytics', 
        element: RestaurantManagerDashboard, 
        protected: true,
        requiredRole: 'gestionnaire' 
      },
      { 
        path: '/dashboard/restaurant-manager/restaurant-details', 
        element: RestaurantManagerDetails, 
        protected: true,
        requiredRole: 'gestionnaire' 
      },
      { 
        path: '/dashboard/restaurant-manager/add-menu-item/:restoId', 
        element: AddMenuItemRestaurantManager, 
        protected: true,
        requiredRole: 'gestionnaire' 
      },
      { 
        path: '/dashboard/restaurant-manager/view-orders', 
        element: ViewOrders, 
        protected: true,
        requiredRole: 'gestionnaire' 
      },
      { 
        path: '/dashboard/restaurant-manager/edit-menu-item/:id', 
        element: EditMenuItem, 
        protected: true,
        requiredRole: 'gestionnaire' 
      },
      // driver routes
      { 
        path: '/dashboard/restaurant-manager/delivery-drivers', 
        element: ListDeliveryDriverForRestManager, 
        protected: true,
        requiredRole: 'gestionnaire' 
      },
    ],
  },
  {
    element: (props) => <DefaultLayout {...props} userRole="super_admin" />,
    children: [
      { 
        path: '/dashboard/super-admin', 
        element: SuperAdminDashboard, 
        protected: true,
        requiredRole: 'super_admin'
      },
      { 
        path: '/dashboard/super-admin/manage-restaurants', 
        element: ManageRestaurants, 
        protected: true,
        requiredRole: 'super_admin' 
      },
      { 
        path: '/dashboard/super-admin/restaurant-details/:id', 
        element: RestaurantDetails, 
        protected: true,
        requiredRole: 'super_admin' 
      },
      { 
        path: '/dashboard/super-admin/add-restaurant', 
        element: AddRestaurant, 
        protected: true,
        requiredRole: 'super_admin' 
      },
      { 
        path: '/dashboard/super-admin/approve-restaurant', 
        element: ApproveRestaurants, 
        protected: true,
        requiredRole: 'super_admin' 
      },
      { 
        path: '/dashboard/super-admin/add-menu-item', 
        element: AddMenuItem, 
        protected: true,
        requiredRole: 'super_admin' 
      },
      { 
        path: '/dashboard/super-admin/delivery-drivers', 
        element: ListDeliveryDrivers, 
        protected: true,
        requiredRole: 'super_admin' 
      },
      { 
        path: '/dashboard/super-admin/add-delivery-driver', 
        element: AddDeliveryDriver, 
        protected: true,
        requiredRole: 'super_admin' 
      },
      { 
        path: '/dashboard/super-admin/edit-delivery-driver/:id', 
        element: EditDeliveryDriver, 
        protected: true,
        requiredRole: 'super_admin' 
      }, 
    ],
  },
  {
    element: BlankLayout,
    children: [
      { path: '/login', element: Login, protected: false },
      { path: '/register', element: Register, protected: false },
      { path: '/register-client', element: RegisterClient, protected: false },
      { path: '/register-restaurant', element: RegisterRestaurant, protected: false },
      { path: '/verify-email/:token', element: VerifyEmail, protected: false },
      { path: '/verify-otp/', element: VerifyOtp, protected: false },
      { path: '/logout', element: Logout, protected: false },
      { path: '/forgot-password', element: ForgotPassword, protected: false },
      { path: '/reset-password/:token', element: ResetPassword, protected: false },
      { path: '*', element: NotFound, protected: false },
    ],
  },
];
