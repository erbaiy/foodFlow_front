import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Eye, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axiosInstance from '../../config/axios';
import OrderDetailsModal from '../../components/OrderDetailsModal';

export const OrderStatus = {
  PENDING: 'pending',
  PREPARING: 'preparing', 
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const DriverDeliveryOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { id } = user;

  const fetchDriverOrders = async () => {
    try {
      
      const res = await axiosInstance.get(`driver/deliverer/${id}/orders`);

      setOrders(res.data);
      console.log(res.data);
      setFilteredOrders(res.data);
    } catch (error) {
      console.error('Error fetching driver orders:', error);
      toast.error(t('Failed to load orders'));
    }
  };
  
  useEffect(() => {
    fetchDriverOrders();
  }, []);

  // WebSocket connection
//   useEffect(() => {
//   const socket = io('http://localhost:3005/socket');

//   socket.on('connect', () => {
//     console.log('WebSocket connection established');
//     socket.emit('joinRoom', id);
//   });

//   socket.on('newCommand', (data) => {
//     if (data.delivererId === id) {
//       const newOrder = data;
//       setOrders(prevOrders => [newOrder, ...prevOrders]);
//       setFilteredOrders(prevOrders => [newOrder, ...prevOrders]);
//       console.log('New order received:', newOrder);
//       toast.success(t('New order assigned to you'));
//     }
//   });

//   socket.on('orderUpdate', (data) => {
//     if (data.delivererId === id) {
//       fetchDriverOrders();
//       toast.success(t('Order update received'));
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('WebSocket connection closed');
//   });

//   socket.on('error', (error) => {
//     console.error('WebSocket error:', error);
//     toast.error(t('Connection error')); 
//   });

//   return () => {
//     socket.disconnect();
//   };
// }, [id, t]);
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        (order.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toString().includes(searchTerm)) &&
        (statusFilter === 'all' || order.status === statusFilter)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleMarkAsDelivered = async (orderId) => {
    try {
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: OrderStatus.DELIVERED } : order
      );
      setOrders(updatedOrders);

      await axiosInstance.put(`driver/orders/${orderId}/confirm`);

      toast.success(t('Order marked as delivered successfully'));
    } catch (error) {
      toast.error(t('Failed to update order status'));
      console.error('Error updating order status:', error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-slate-900 rounded-md shadow-md">
      <Toaster richColors />
      <h1 className="text-3xl font-bold mb-6 dark:text-white">{t('My Delivery Orders')}</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            placeholder={t('Search orders...')}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-white border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <div className="flex items-center">
          <select
            className="px-4 py-2 rounded-lg border bg-white border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{t('All Statuses')}</option>
            <option value={OrderStatus.READY}>{t('Ready')}</option>
            <option value={OrderStatus.DELIVERED}>{t('Delivered')}</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-md overflow-hidden shadow-md">
        <table className="w-full">
          <thead className="bg-white dark:bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                {t('Order ID')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                {t('Customer')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                {t('Date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                {t('Status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                {t('Delivery Address')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                {t('Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white dark:bg-slate-800 divide-slate-200 dark:divide-slate-700">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <td className="px-6 py-4 whitespace-nowrap dark:text-white">{order._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-white">{order.client?.fullName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          order.status === OrderStatus.READY
                            ? 'bg-green-500 text-slate-50'
                            : order.status === OrderStatus.DELIVERED
                            ? 'bg-blue-500 text-slate-50'
                            : 'bg-yellow-500 text-slate-50'
                        }`}
                    >
                      {t(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                    {order.client.address || t('Not specified')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-700 mr-2"
                      onClick={() => handleViewDetails(order)}
                      title={t('View Details')}
                    >
                      <Eye size={22} />
                    </button>

                    {order.status === OrderStatus.READY && (
                      <button
                        className="text-green-600 hover:text-green-700 mr-2"
                        onClick={() => handleMarkAsDelivered(order._id)}
                        title={t('Mark as Delivered')}
                      >
                        <Truck size={22} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center dark:text-white">
                  {t('No orders found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverDeliveryOrders;






