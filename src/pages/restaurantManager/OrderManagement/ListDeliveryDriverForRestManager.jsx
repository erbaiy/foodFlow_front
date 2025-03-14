import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'sonner';
import { Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../config/axios';
import { set } from 'lodash';

const ListDeliveryDriverForRestManager = () => {
  const { t } = useTranslation();
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [driversPerPage] = useState(10);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axiosInstance.get('orders-manager/get/driver');
     
          setDrivers(response?.data);
       
      } catch (error) {
        console.error('Error fetching delivery drivers:', error);
        toast.error(t('Failed to load delivery drivers'));
      }
    };

    fetchDrivers();
  }, [t]);

  

  const handleDelete = async (id) => {
    try {
      if (window.confirm(t('Are you sure you want to delete this driver?'))) {
        await axiosInstance.delete(`/super-admin/delivery-driver/${id}`);
        
        // Update state after successful deletion
        toast.success(t('Delivery driver deleted successfully'));
      }
    } catch (error) {
      console.error('Error deleting delivery driver:', error);
      toast.error(t('Failed to delete delivery driver'));
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phoneNumber.includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirstDriver, indexOfLastDriver);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto p-6 border border-slate-200 dark:border-slate-800 rounded-md bg-slate-50 dark:bg-slate-900">
      <Toaster richColors />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('Delivery Drivers')}</h1>
        <Link
          to="/dashboard/super-admin/add-delivery-driver"
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {t('Add Driver')}
        </Link>
      </div>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder={t('Search drivers...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Name')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Email')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Phone')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {currentDrivers.length > 0 ? (
              currentDrivers.map((driver) => (
                <tr key={driver._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                    {driver.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {driver.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {driver.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end">
                    <Link
                      to={`/dashboard/super-admin/edit-delivery-driver/${driver._id}`}
                      state={{ driverData: driver }}
                      className="text-green-500 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(driver._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  {t('No drivers found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-slate-700 dark:text-slate-300">
          {t('Showing')} {indexOfFirstDriver + 1} - {Math.min(indexOfLastDriver, filteredDrivers.length)} {t('of')} {filteredDrivers.length} {t('drivers')}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastDriver >= filteredDrivers.length}
            className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListDeliveryDriverForRestManager;