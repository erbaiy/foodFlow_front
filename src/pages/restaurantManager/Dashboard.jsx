import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/axios';
import { useSelector } from 'react-redux';

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

// Data table component for displaying top menu items
function TopMenuItemsTable({ title, subtitle, data }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      <div className="mt-4 overflow-x-auto shadow-sm rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
              <th className="py-2 px-4">Menu Item</th>
              <th className="py-2 px-4 text-right">Orders This Week</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.menuItemId} className="border-t dark:border-gray-700">
                <td className="py-3 px-4 font-medium dark:text-white">{item.menuItemId}</td>
                <td className="py-3 px-4 text-right dark:text-white">{item.ordersThisWeek}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main Restaurant Manager Dashboard component
export function RestaurantManagerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      restaurantName: '',
      status: '',
      weeklyOrders: 0,
      totalOrders: 0,
      weeklyRevenue: '$0',
      totalRevenue: '$0',
    },
    weeklyOrdersData: [],
    topMenuItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth=useSelector(state=>state.auth)
  const managerId=auth.user.id

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard data for the restaurant manager
        const response = await axiosInstance.get(`/resto-manager/dashboard/${managerId}`);
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

  const { stats, weeklyOrdersData, topMenuItems } = dashboardData;

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
          title="Restaurant Name"
          value={stats.restaurantName}
          subtitle={`Status: ${stats.status}`}
          icon="🍴"
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

      {/* Top Menu Items Table */}
      <TopMenuItemsTable
        title="Top Menu Items"
        subtitle="Most ordered items this week"
        data={topMenuItems}
      />
    </div>
  );
}

export default RestaurantManagerDashboard;