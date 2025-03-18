import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/axios';

// Stats card component for displaying key metrics
function StatsCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold dark:text-white">{value}</p>
        <p className="text-xs text-gray-400 dark:text-gray-300">{subtitle}</p>
      </div>
    </div>
  );
}

// Chart component for displaying weekly orders
function WeeklyOrdersChart({ data }) {
  const maxOrders = Math.max(...data.map((d) => d.orders));
  const totalOrders = data.reduce((sum, day) => sum + day.orders, 0);
  const [chartType, setChartType] = useState('bar');

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold dark:text-white">Weekly Orders</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">Order volume for the current week</p>
      <div className="mt-4">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 text-sm font-medium ${chartType === 'bar' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500'} rounded-lg hover:bg-blue-100 transition-colors`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
            <button 
              className={`px-3 py-1 text-sm font-medium ${chartType === 'line' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-500'} rounded-lg hover:bg-gray-100 transition-colors`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: {totalOrders.toLocaleString()} orders
          </p>
        </div>
        <div className="h-64 w-full flex items-end gap-2">
          {data.map((day) => (
            <div key={day.day} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-500 rounded-t-md transition-all duration-300"
                style={{
                  height: `${(day.orders / maxOrders) * 220}px`,
                }}
              />
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{day.day}</div>
              <div className="text-xs font-medium dark:text-white">{day.orders.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Data table component for displaying entities with status
function DataTable({ title, subtitle, data, columns }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      <div className="mt-4 overflow-x-auto shadow-sm rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`py-2 px-4 ${column.align === "right" ? "text-right" : ""}`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t dark:border-gray-700">
                {columns.map((column) => (
                  <td
                    key={`${item.id}-${column.key}`}
                    className={`py-3 px-4 ${column.align === "right" ? "text-right" : ""} ${
                      column.key !== "status" ? "dark:text-white" : ""
                    } ${column.key === "name" ? "font-medium" : ""}`}
                  >
                    {column.key === "status" ? (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item[column.key] === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item[column.key]}
                      </span>
                    ) : column.key === "rating" ? (
                      item[column.key].toFixed(1)
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main SuperAdmin dashboard component
export function SuperAdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRestaurants: 0,
      activeRestaurants: 0,
      totalDrivers: 0,
      activeDrivers: 0,
      weeklyOrders: 0,
      totalOrders: 0,
      weeklyRevenue: "$0",
      totalRevenue: "$0"
    },
    weeklyOrdersData: [],
    drivers: [],
    restaurants: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all dashboard data in one request
        const response = await axiosInstance.get('/super-admin/dashboard');
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const { stats, weeklyOrdersData, drivers, restaurants } = dashboardData;

  const driverColumns = [
    { key: "name", title: "Name" },
    { key: "status", title: "Status" },
    { key: "deliveries", title: "Deliveries", align: "right" },
    { key: "rating", title: "Rating", align: "right" },
  ];

  const restaurantColumns = [
    { key: "name", title: "Name" },
    { key: "status", title: "Status" },
    { key: "ordersThisWeek", title: "Orders", align: "right" },
    { key: "rating", title: "Rating", align: "right" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Restaurants"
          value={stats.totalRestaurants.toLocaleString()}
          subtitle={`${stats.activeRestaurants.toLocaleString()} active`}
          icon="🍴"
        />
        <StatsCard
          title="Drivers"
          value={stats.totalDrivers.toLocaleString()}
          subtitle={`${stats.activeDrivers.toLocaleString()} active`}
          icon="🚚"
        />
        <StatsCard
          title="Weekly Orders"
          value={stats.weeklyOrders.toLocaleString()}
          subtitle={`${stats.totalOrders.toLocaleString()} total orders`}
          icon="🛍️"
        />
        <StatsCard
          title="Weekly Revenue"
          value={stats.weeklyRevenue}
          subtitle={`${stats.totalRevenue} total revenue`}
          icon="💰"
        />
      </div>

      {/* Weekly Orders Chart */}
      <WeeklyOrdersChart data={weeklyOrdersData} />

      {/* Top Drivers Table */}
      <DataTable
        title="Top Drivers"
        subtitle="Drivers with the most deliveries this week"
        data={drivers}
        columns={driverColumns}
      />

      {/* Top Restaurants Table */}
      <DataTable
        title="Top Restaurants"
        subtitle="Restaurants with the most orders this week"
        data={restaurants}
        columns={restaurantColumns}
      />
    </div>
  );
}

export default SuperAdminDashboard;










// import React from "react";
// import PropTypes from "prop-types";

// // Mock data for the dashboard
// const mockData = {
//   // Stats for the dashboard cards
//   stats: {
//     totalRestaurants: 420,
//     activeRestaurants: 387,
//     totalDrivers: 1250,
//     activeDrivers: 964,
//     weeklyOrders: 8742,
//     totalOrders: 145879,
//     weeklyRevenue: "$125,430",
//     totalRevenue: "$2.3M"
//   },
  
//   // Data for the weekly orders chart
//   weeklyOrdersData: [
//     { day: "Mon", orders: 1245 },
//     { day: "Tue", orders: 1180 },
//     { day: "Wed", orders: 1340 },
//     { day: "Thu", orders: 1465 },
//     { day: "Fri", orders: 1587 },
//     { day: "Sat", orders: 1125 },
//     { day: "Sun", orders: 800 }
//   ],
  
//   // Data for the top drivers table
//   drivers: [
//     { id: 1, name: "John Smith", status: "active", deliveries: 78, rating: 4.9 },
//     { id: 2, name: "Maria Garcia", status: "active", deliveries: 65, rating: 4.8 },
//     { id: 3, name: "Kevin Johnson", status: "active", deliveries: 62, rating: 4.7 },
//     { id: 4, name: "Sarah Lee", status: "active", deliveries: 59, rating: 4.9 },
//     { id: 5, name: "David Wilson", status: "inactive", deliveries: 52, rating: 4.6 }
//   ],
  
//   // Data for the top restaurants table
//   restaurants: [
//     { id: 1, name: "Burger Palace", status: "active", ordersThisWeek: 345, rating: 4.7 },
//     { id: 2, name: "Thai Delight", status: "active", ordersThisWeek: 287, rating: 4.8 },
//     { id: 3, name: "Pizza Express", status: "active", ordersThisWeek: 275, rating: 4.5 },
//     { id: 4, name: "Sushi World", status: "active", ordersThisWeek: 240, rating: 4.9 },
//     { id: 5, name: "Taco Corner", status: "inactive", ordersThisWeek: 198, rating: 4.3 }
//   ]
// };

// /**
//  * Stats card component for displaying key metrics
//  */
// function StatsCard({ title, value, subtitle, icon }) {
//   return (
//     <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
//       <div className="flex items-center justify-between">
//         <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
//         <span className="text-lg">{icon}</span>
//       </div>
//       <div className="mt-2">
//         <p className="text-2xl font-bold dark:text-white">{value}</p>
//         <p className="text-xs text-gray-400 dark:text-gray-300">{subtitle}</p>
//       </div>
//     </div>
//   );
// }

// StatsCard.propTypes = {
//   title: PropTypes.string.isRequired,
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//   subtitle: PropTypes.string,
//   icon: PropTypes.node
// };

// StatsCard.defaultProps = {
//   subtitle: "",
//   icon: null
// };

// /**
//  * Chart component for displaying weekly orders
//  */
// function WeeklyOrdersChart({ data }) {
//   const maxOrders = Math.max(...data.map((d) => d.orders));
//   const totalOrders = data.reduce((sum, day) => sum + day.orders, 0);

//   return (
//     <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
//       <h2 className="text-lg font-semibold dark:text-white">Weekly Orders</h2>
//       <p className="text-sm text-gray-500 dark:text-gray-400">Order volume for the current week</p>
//       <div className="mt-4">
//         <div className="flex justify-between mb-4">
//           <div className="flex space-x-2">
//             <button className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
//               Bar
//             </button>
//             <button className="px-3 py-1 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
//               Line
//             </button>
//           </div>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Total: {totalOrders.toLocaleString()} orders
//           </p>
//         </div>
//         <div className="h-[300px] w-full flex items-end gap-2">
//           {data.map((day) => (
//             <div key={day.day} className="flex flex-col items-center flex-1">
//               <div
//                 className="w-full bg-blue-500 rounded-t-md transition-all duration-300"
//                 style={{
//                   height: `${(day.orders / maxOrders) * 220}px`,
//                 }}
//               />
//               <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{day.day}</div>
//               <div className="text-xs font-medium dark:text-white">{day.orders.toLocaleString()}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// WeeklyOrdersChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       day: PropTypes.string.isRequired,
//       orders: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// /**
//  * Data table component for displaying entities with status
//  */
// function DataTable({ title, subtitle, data, columns }) {
//   return (
//     <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
//       <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
//       <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
//       <div className="mt-4 overflow-x-auto shadow-sm rounded-lg">
//         <table className="w-full">
//           <thead>
//             <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
//               {columns.map((column) => (
//                 <th
//                   key={column.key}
//                   className={`py-2 px-4 ${column.align === "right" ? "text-right" : ""}`}
//                 >
//                   {column.title}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr key={item.id} className="border-t dark:border-gray-700">
//                 {columns.map((column) => (
//                   <td
//                     key={`${item.id}-${column.key}`}
//                     className={`py-3 px-4 ${column.align === "right" ? "text-right" : ""} ${
//                       column.key !== "status" ? "dark:text-white" : ""
//                     } ${column.key === "name" ? "font-medium" : ""}`}
//                   >
//                     {column.key === "status" ? (
//                       <span
//                         className={`px-2 py-1 text-xs rounded-full ${
//                           item[column.key] === "active"
//                             ? "bg-green-100 text-green-600"
//                             : "bg-gray-100 text-gray-600"
//                         }`}
//                       >
//                         {item[column.key]}
//                       </span>
//                     ) : column.key === "rating" ? (
//                       item[column.key].toFixed(1)
//                     ) : (
//                       item[column.key]
//                     )}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// DataTable.propTypes = {
//   title: PropTypes.string.isRequired,
//   subtitle: PropTypes.string.isRequired,
//   data: PropTypes.array.isRequired,
//   columns: PropTypes.arrayOf(
//     PropTypes.shape({
//       key: PropTypes.string.isRequired,
//       title: PropTypes.string.isRequired,
//       align: PropTypes.oneOf(["left", "right"]),
//     })
//   ).isRequired,
// };

// /**
//  * Main SuperAdmin dashboard component
//  */
// export function SuperAdminDashboard() {
//   const { stats, weeklyOrdersData, drivers, restaurants } = mockData;

//   const driverColumns = [
//     { key: "name", title: "Name" },
//     { key: "status", title: "Status" },
//     { key: "deliveries", title: "Deliveries", align: "right" },
//     { key: "rating", title: "Rating", align: "right" },
//   ];

//   const restaurantColumns = [
//     { key: "name", title: "Name" },
//     { key: "status", title: "Status" },
//     { key: "ordersThisWeek", title: "Orders", align: "right" },
//     { key: "rating", title: "Rating", align: "right" },
//   ];

//   return (
//     <div className="p-4 space-y-6">
//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <StatsCard
//           title="Restaurants"
//           value={stats.totalRestaurants.toLocaleString()}
//           subtitle={`${stats.activeRestaurants.toLocaleString()} active`}
//           icon="🍴"
//         />
//         <StatsCard
//           title="Drivers"
//           value={stats.totalDrivers.toLocaleString()}
//           subtitle={`${stats.activeDrivers.toLocaleString()} active`}
//           icon="🚚"
//         />
//         <StatsCard
//           title="Weekly Orders"
//           value={stats.weeklyOrders.toLocaleString()}
//           subtitle={`${stats.totalOrders.toLocaleString()} total orders`}
//           icon="🛍️"
//         />
//         <StatsCard
//           title="Weekly Revenue"
//           value={stats.weeklyRevenue}
//           subtitle={`${stats.totalRevenue} total revenue`}
//           icon="💰"
//         />
//       </div>

//       {/* Weekly Orders Chart */}
//       <WeeklyOrdersChart data={weeklyOrdersData} />

//       {/* Top Drivers Table */}
//       <DataTable
//         title="Top Drivers"
//         subtitle="Drivers with the most deliveries this week"
//         data={drivers}
//         columns={driverColumns}
//       />

//       {/* Top Restaurants Table */}
//       <DataTable
//         title="Top Restaurants"
//         subtitle="Restaurants with the most orders this week"
//         data={restaurants}
//         columns={restaurantColumns}
//       />
//     </div>
//   );
// }

// export default SuperAdminDashboard;