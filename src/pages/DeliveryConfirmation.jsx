import React, { useState, useEffect } from 'react';
import { Package, MapPin, User, Phone, Check } from 'lucide-react';
import OtpConfirmationModal from '../components/OtpConfirmationModal';

const DeliveryConfirmation = () => {
  const [capturedOrders, setCapturedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch captured orders for the driver
    fetchCapturedOrders();
  }, []);

  const fetchCapturedOrders = async () => {
    // This should be an API call to fetch captured orders for the driver
    const mockCapturedOrders = [
      { id: 1, customerName: 'John Doe', address: '123 Main St, City', phone: '123-456-7890', items: ['Pizza', 'Soda'] },
      { id: 2, customerName: 'Jane Smith', address: '456 Elm St, Town', phone: '098-765-4321', items: ['Burger', 'Fries', 'Milkshake'] },
    ];
    setCapturedOrders(mockCapturedOrders);
  };

  const handleConfirmDelivery = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleOtpConfirmation = async (otp) => {
    // This should be an API call to confirm delivery with OTP
    // Simulating successful confirmation
    setCapturedOrders(capturedOrders.filter(order => order.id !== selectedOrder.id));
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900 md:py-20 lg:py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">Captured Orders</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capturedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold mb-4 text-primary">Order #{order.id}</h2>
              <div className="space-y-2 mb-4">
                <p className="flex items-center text-slate-600 dark:text-slate-300">
                  <User size={18} className="mr-2" /> {order.customerName}
                </p>
                <p className="flex items-center text-slate-600 dark:text-slate-300">
                  <MapPin size={18} className="mr-2" /> {order.address}
                </p>
                <p className="flex items-center text-slate-600 dark:text-slate-300">
                  <Phone size={18} className="mr-2" /> {order.phone}
                </p>
                <div className="flex items-start text-slate-600 dark:text-slate-300">
                  <Package size={18} className="mr-2 mt-1" />
                  <span>{order.items.join(', ')}</span>
                </div>
              </div>
              <button
                onClick={() => handleConfirmDelivery(order)}
                className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                <Check size={18} className="mr-2" /> Confirm Delivery
              </button>
            </div>
          ))}
        </div>

        {capturedOrders.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 mt-8">
            No captured orders at the moment.
          </p>
        )}

        <OtpConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleOtpConfirmation}
          orderId={selectedOrder?.id}
        />
      </div>
    </section>
  );
};

export default DeliveryConfirmation;