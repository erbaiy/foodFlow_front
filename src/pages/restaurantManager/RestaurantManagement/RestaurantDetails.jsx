import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast, Toaster } from 'sonner';

import axiosInstance from '../../../config/axios';
import RestaurantHeader from '../../../components/RestaurantDetails/RestaurantHeader';
import MenuSection from '../../../components/RestaurantDetails/MenuSection';
import RestaurantInfoSection from '../../../components/RestaurantDetails/RestaurantInfoSection';
import UpdateRestaurant from './UpdateRestaurant'; // Import the UpdateRestaurant component

const RestaurantDetails = () => {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    
    const [restaurantData, setRestaurantData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for update modal

    useEffect(() => {
        if (user?.id) {
            fetchRestaurantData();
        }
    }, [user]);

    const fetchRestaurantData = async () => {
        try {
            const response = await axiosInstance.get(`restaurant-manager/restaurant-profile/${user.id}`);
            const result = response.data.data.result;
            setRestaurantData(result);
        } catch (error) {
            console.error('Error fetching restaurant data:', error);
            toast.error(t('Failed to load restaurant data'));
        } finally {
            setLoading(false);
        }
    };

    const handleEditMenuItem = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setIsModalOpen(true);
    };

    const handleSaveMenuItem = async (updatedItem) => {
        try {
            await axiosInstance.put(`menu-manager/${updatedItem.id}`, updatedItem);
            
            setRestaurantData((prevData) => ({
                ...prevData,
                menu: prevData.menu.map((item) =>
                    item.id === updatedItem.id ? updatedItem : item
                ),
            }));
            
            toast.success(t('Menu item updated successfully'));
        } catch (error) {
            console.error('Error updating menu item:', error);
            toast.error(t('Failed to update menu item'));
        }
    };

    // Function to open the update modal
    const handleOpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
    };

    // Function to close the update modal
    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                {t('Please login to view restaurant details')}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                {t('Loading...')}
            </div>
        );
    }

    if (!restaurantData) {
        return (
            <div className="flex justify-center items-center h-screen">
                {t('No restaurant data available')}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden">
            <Toaster richColors />
            <RestaurantHeader 
                restaurantData={restaurantData} 
                onEditRestaurant={handleOpenUpdateModal} // Pass the function to open the update modal
            />
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MenuSection 
                        menu={restaurantData.menu} 
                        userRole="gestionnaire" 
                        onEdit={handleEditMenuItem} 
                        restoId={restaurantData._id}
                    />
                    <RestaurantInfoSection restaurantData={restaurantData} />
                </div>
            </div>

            {/* Render the UpdateRestaurant component conditionally */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-3xl">
                    <UpdateRestaurant
  restaurantData={restaurantData} // Pass existing restaurant data
  onClose={() => setIsUpdateModalOpen(false)} // Close modal
  onUpdateSuccess={(updatedData) => {
    setRestaurantData(updatedData); // Update parent state
    toast.success("Restaurant updated successfully");
  }}
/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantDetails;










// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useSelector } from 'react-redux';
// import { toast, Toaster } from 'sonner';

// import axiosInstance from '../../../config/axios';
// import RestaurantHeader from '../../../components/RestaurantDetails/RestaurantHeader';
// import MenuSection from '../../../components/RestaurantDetails/MenuSection';
// import RestaurantInfoSection from '../../../components/RestaurantDetails/RestaurantInfoSection';

// const RestaurantDetails = () => {
//     const { t } = useTranslation();
//     const { isAuthenticated, user } = useSelector((state) => state.auth);
    
//     const [restaurantData, setRestaurantData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedMenuItem, setSelectedMenuItem] = useState(null);

//     useEffect(() => {
//         if (user?.id) {
//             fetchRestaurantData();
//         }
//     }, [user]);

//     const fetchRestaurantData = async () => {
//         try {
//             const response = await axiosInstance.get(`restaurant-manager/restaurant-profile/${user.id}`);
//             const result = response.data.data.result;
//             setRestaurantData(result);
//         } catch (error) {
//             console.error('Error fetching restaurant data:', error);
//             toast.error(t('Failed to load restaurant data'));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEditMenuItem = (menuItem) => {
//         setSelectedMenuItem(menuItem);
//         setIsModalOpen(true);
//     };

//     const handleSaveMenuItem = async (updatedItem) => {
//         try {
//             await axiosInstance.put(`menu-manager/${updatedItem.id}`, updatedItem);
            
//             setRestaurantData((prevData) => ({
//                 ...prevData,
//                 menu: prevData.menu.map((item) =>
//                     item.id === updatedItem.id ? updatedItem : item
//                 ),
//             }));
            
//             toast.success(t('Menu item updated successfully'));
//         } catch (error) {
//             console.error('Error updating menu item:', error);
//             toast.error(t('Failed to update menu item'));
//         }
//     };

//     if (!isAuthenticated || !user) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 {t('Please login to view restaurant details')}
//             </div>
//         );
//     }

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 {t('Loading...')}
//             </div>
//         );
//     }

//     if (!restaurantData) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 {t('No restaurant data available')}
//             </div>
//         );
//     }

//     return (
//         <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden">
//             <Toaster richColors />
//             <RestaurantHeader restaurantData={restaurantData} />
//             <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <MenuSection 
//                         menu={restaurantData.menu} 
//                         userRole="gestionnaire" 
//                         onEdit={handleEditMenuItem} 
//                         restoId={restaurantData._id}
//                     />
//                     <RestaurantInfoSection restaurantData={restaurantData} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RestaurantDetails; 