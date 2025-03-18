import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { useSelector } from 'react-redux';
import axiosInstance from '../../config/axios';
import OrderDetailsModal from '../../components/OrderDetailsModal';

const HistoryDriver = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]); // Stores all orders fetched from the API
  const [filteredOrders, setFilteredOrders] = useState([]); // Stores filtered orders based on search
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering orders
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for modal details
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const { user } = useSelector((state) => state.auth); // Get logged-in user from Redux
  const { id } = user; // Driver ID

  // Fetch delivery history for the driver
  const fetchDeliveryHistory = async () => {
    try {
      const res = await axiosInstance.get(`driver/deliverer/${id}/history`);
      setOrders(res.data); // Set all orders
      setFilteredOrders(res.data); // Set filtered orders initially
    } catch (error) {
      console.error('Error fetching delivery history:', error);
      toast.error(t(res.data));
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    console.log(user);
    fetchDeliveryHistory();
  }, []);

  // Filter orders based on search term (client name or order ID)
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toString().includes(searchTerm)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Handle viewing order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-slate-900 rounded-md shadow-md">
      <Toaster richColors />
      <h1 className="text-3xl font-bold mb-6 dark:text-white">{t('My Delivery History')}</h1>

      {/* Search Bar */}
      <div className="relative w-full mb-6">
        <input
          type="text"
          placeholder={t('Search orders...')}
          className="w-full pl-10 pr-4 py-2 rounded-md border bg-white border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900 dark:border-slate-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      {/* Orders Table */}
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
                  <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                    {order.client?.fullName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                    {order.client?.address || t('Not specified')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-700"
                      onClick={() => handleViewDetails(order)}
                      title={t('View Details')}
                    >
                      <Eye size={22} />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center dark:text-white">
                  {t('No orders found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
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

export default HistoryDriver;