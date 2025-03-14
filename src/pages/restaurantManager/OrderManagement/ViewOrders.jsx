import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import OrderDetailsModal from '../../../components/OrderDetailsModal';
import axiosInstance from '../../../config/axios';
import { useSelector } from 'react-redux';

// Order status enum
export const OrderStatus = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const ViewOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { id } = user;

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get(`orders-manager/restaurant-manager/${id}`);
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(t('Failed to load orders'));
    }
  };

  // Fetch drivers
  const fetchDrivers = async () => {
    try {
      const response = await axiosInstance.get('orders-manager/get/driver');
      setDrivers(response?.data);
    } catch (error) {
      console.error('Error fetching delivery drivers:', error);
      toast.error(t('Failed to load delivery drivers'));
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchOrders();
    fetchDrivers();
  }, []);

  // Filter orders based on search term and status
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        (order.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toString().includes(searchTerm)) &&
        (statusFilter === 'all' || order.status === statusFilter)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      await axiosInstance.patch('orders-manager/status', {
        orderId,
        newStatus,
      });

      toast.success(t('Order status updated successfully'));
    } catch (error) {
      toast.error(t('Failed to update order status'));
      console.error('Error updating order status:', error);
    }
  };

  // Assign order to deliverer
  const handleAssignToDeliverer = async (orderId, delivererId) => {
    try {
      // Send PATCH request to the backend
      const response = await axiosInstance.patch(`orders-manager/${orderId}/assign`, {
        delivererId, // Send delivererId in the request body
      });
  
      if (response.data) {
        // Update the local state to reflect the assignment
        const updatedOrders = orders.map((order) =>
          order._id === orderId ? { ...order, assignedTo: delivererId } : order
        );
        setOrders(updatedOrders);
        toast.success(t('Order assigned to deliverer successfully'));
      }
    } catch (error) {
      toast.error(t('Failed to assign order to deliverer'));
      console.error('Error assigning order to deliverer:', error);
    }
  };

  // View order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-slate-900 rounded-md shadow-md">
      <Toaster richColors />
      <h1 className="text-3xl font-bold mb-6 dark:text-white">{t('Order Management')}</h1>

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
            <option value={OrderStatus.PENDING}>{t('Pending')}</option>
            <option value={OrderStatus.PREPARING}>{t('Preparing')}</option>
            <option value={OrderStatus.READY}>{t('Ready')}</option>
            <option value={OrderStatus.DELIVERED}>{t('Delivered')}</option>
            <option value={OrderStatus.CANCELLED}>{t('Cancelled')}</option>
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
                {t('Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white dark:bg-slate-800 divide-slate-200 dark:divide-slate-700">
            {filteredOrders.map((order) => (
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
                          : order.status === OrderStatus.CANCELLED
                          ? 'bg-red-500 text-slate-50'
                          : 'bg-yellow-500 text-slate-50'
                      }`}
                  >
                    {t(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-indigo-600 hover:text-indigo-700 mr-2"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Eye size={22} />
                  </button>

                  {order.status === OrderStatus.PENDING && (
                    <>
                      <button
                        className="text-yellow-600 hover:text-yellow-700 mr-2"
                        onClick={() => handleStatusChange(order._id, OrderStatus.PREPARING)}
                        title={t('Mark as Preparing')}
                      >
                        <CheckCircle size={22} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleStatusChange(order._id, OrderStatus.CANCELLED)}
                        title={t('Cancel Order')}
                      >
                        <XCircle size={22} />
                      </button>
                    </>
                  )}

                  {order.status === OrderStatus.PREPARING && (
                    <button
                      className="text-green-600 hover:text-green-700 mr-2"
                      onClick={() => handleStatusChange(order._id, OrderStatus.READY)}
                      title={t('Mark as Ready')}
                    >
                      <CheckCircle size={22} />
                    </button>
                  )}

{order.status === OrderStatus.READY && (
  <select
    className="px-2 py-1 rounded-lg border bg-white border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900 dark:border-slate-700 dark:text-white"
    onChange={(e) => handleAssignToDeliverer(order._id, e.target.value)}
    value={order.assignedTo || ''}
  >
    <option value="">{t('Assign to deliverer')}</option>
    {drivers.map((driver) => (
      <option key={driver._id} value={driver._id}>
        {driver.fullName}
      </option>
    ))}
  </select>
)}
                </td>
              </motion.tr>
            ))}
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

export default ViewOrders;