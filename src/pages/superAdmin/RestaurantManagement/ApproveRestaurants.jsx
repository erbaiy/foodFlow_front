import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, ChevronLeft, ChevronRight, User, Utensils, Mail, Phone, MapPin, Bell } from "lucide-react";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from 'prop-types';
import axiosInstance from "../../../config/axios";

const Image_URL = import.meta.env.VITE_RESTO_IMG_SERVER;

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  
  // If it already includes the full URL, return it as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the API host
  // Make sure the path doesn't have duplicate slashes
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `http://localhost:3005${path}`;
};


const Modal = ({ isOpen, onClose, restaurant, onApprove, onReject }) => {
  const { t } = useTranslation();
  if (!isOpen || !restaurant) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900 bg-opacity-80 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{restaurant.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col items-center mb-6">
          <img
              src={getImageUrl(restaurant.logo)}
              alt={`${restaurant.name} logo`}
              className="w-24 h-24 rounded-full mb-4"
            />            
            <span className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full">{restaurant.cuisineType}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md"> 
              <InfoItem icon={<User size={18} />} label={t("Owner")} value={restaurant.manager?.fullName} />
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md"> 
              <InfoItem icon={<Mail size={18} />} label={t("Email")} value={restaurant.manager?.email} />
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md"> 
              <InfoItem icon={<Phone size={18} />} label={t("Phone")} value={restaurant.manager?.phoneNumber} />
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md"> 
              <InfoItem icon={<Utensils size={18} />} label={t("Cuisine Type")} value={restaurant.cuisineType} />
            </div>
          </div>
          
          <div className="mb-6 p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
            <InfoItem icon={<MapPin size={18} />} label={t("Address")} value={restaurant.address} />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button onClick={onReject} variant="danger">
              <X size={18} className="mr-2" />
              {t("Reject")}
            </Button>
            <Button onClick={onApprove} variant="success">
              <Check size={18} className="mr-2" />
              {t("Approve")}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 text-gray-500 dark:text-gray-400 mr-3">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  </div>
);

const Button = ({ children, onClick, variant }) => {
  const baseClasses = "px-4 py-2 rounded-md transition-colors flex items-center justify-center";
  const variantClasses = {
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};

const ApproveRestaurants = () => {
  const { t } = useTranslation();
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const itemsPerPage = 6;

  const openModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get(`/super-admin/restaurants/pending/all`);
        const restaurantData = response.data.data.result; // Access the `result` array

        console.log("restaurantData  ", restaurantData);
        setRestaurants(restaurantData);

        
       
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      }
    };
  
    fetchRestaurants();
  }, []);

  const approveRestaurant = async (id) => {
    try {
      await axiosInstance.put(`/super-admin/restaurants/${id}/approve`);
    } catch (error) {
      console.error('Failed to approve restaurant:', error);
      throw error;
    }
  };

  const rejectRestaurant = async (id) => {
    console.log('regect')
    try {
      await axiosInstance.put(`/super-admin/restaurants/${id}/reject`);
    } catch (error) {
      console.error('Failed to reject restaurant:', error);
      throw error;
    }
  };

  const handleApprove = useCallback(async () => {
    if (!selectedRestaurant) return;

    setRestaurants((prev) => prev.filter((r) => r._id !== selectedRestaurant._id));
    toast.success(t("Restaurant approved"), {
      description: t("{{name}} has been approved", { name: selectedRestaurant.name }),
    });
    setIsModalOpen(false);

    try {
      await approveRestaurant(selectedRestaurant._id);
    } catch (error) {
      console.error('Approval failed on backend:', error);
    }
  }, [selectedRestaurant, setRestaurants, setIsModalOpen, t]);

  const handleReject = useCallback(async () => {
    if (!selectedRestaurant) return;

    setRestaurants((prev) => prev.filter((r) => r._id !== selectedRestaurant._id));
    toast.error(t("Restaurant rejected"), {
      description: t("{{name}} has been rejected", { name: selectedRestaurant.name }),
    });
    setIsModalOpen(false);

    try {
      await rejectRestaurant(selectedRestaurant._id);
    } catch (error) {
      console.error('Rejection failed on backend:', error);
    }
  }, [selectedRestaurant, setRestaurants, setIsModalOpen, t]);

  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;
  const currentRestaurants = restaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 3;

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage, '...', totalPages);
      }
    }

    return pageNumbers.map((number, index) => (
      <button
        key={index}
        type="button"
        onClick={() => typeof number === 'number' && setCurrentPage(number)}
        className={`min-h-[38px] min-w-[38px] flex justify-center items-center ${
          currentPage === number
            ? "bg-gray-200 text-gray-800 dark:bg-primary dark:text-white"
            : "text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
        } py-2 px-3 text-sm rounded-full focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:focus:bg-white/10`}
        aria-current={currentPage === number ? "page" : undefined}
        disabled={typeof number !== 'number'}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster richColors />
      <h1 className="text-3xl font-bold mb-6">{t("Approve Restaurants")}</h1>
      {restaurants.length === 0 ? (
        <p className="text-center py-8">{t("No pending restaurants to approve.")}</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {currentRestaurants.map((restaurant) => (
              <motion.div
                key={restaurant._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 flex flex-col items-center">
                  <img       
                      src={getImageUrl(restaurant.logo)}

                   alt={`${restaurant.name} logo`} className="w-24 h-24 rounded-full mb-4" />
                  <h2 className="text-xl font-semibold mb-2 text-center">{restaurant.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">{restaurant.cuisineType}</p>
                  <button
                    onClick={() => openModal(restaurant)}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    {t("View Details")}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <nav className="flex justify-center items-center space-x-2 mt-8" aria-label="Pagination">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            {renderPageNumbers()}
            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        </>
      )}
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            restaurant={selectedRestaurant}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  restaurant: PropTypes.object,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

InfoItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['danger', 'success']).isRequired,
};

export default ApproveRestaurants;