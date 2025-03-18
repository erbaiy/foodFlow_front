import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import RestaurantCard from "../../../components/RestaurantDetails/RestaurantCard";
import axiosInstance from "../../../config/axios";

const ManageRestaurants = () => {
  const { t } = useTranslation();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCuisine, setFilterCuisine] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Helper function to build proper image URLs
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

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/super-admin/restaurants');
      console.log("API Response:", response);
  
      if (response.status === 200) {
        // Extract the restaurant data from the response
        const restaurantData = response.data.data.result; // Access the `result` array
  
        if (Array.isArray(restaurantData)) {
          setRestaurants(restaurantData);
          setFilteredRestaurants(restaurantData);
        } else {
          console.error("Unexpected data structure:", response.data);
          setRestaurants([]);
          setFilteredRestaurants([]);
        }
      }
    } catch (error) {
      console.error("Error fetching restaurant data: ", error);
      setRestaurants([]);
      setFilteredRestaurants([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const filtered = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCuisine === "all" || restaurant.cuisineType === filterCuisine)
    );
    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterCuisine, restaurants]);

    // Function to handle deletion
    const handleDelete = (deletedId) => {
      setRestaurants(prevRestaurants => 
        prevRestaurants.filter(restaurant => restaurant._id !== deletedId)
      );
    };
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilterCuisine(e.target.value);

  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewDetails = (id) => {
    navigate(`/dashboard/super-admin/restaurant-details/${id}`);
  };

  const handleAddRestaurant = () => {
    navigate("/dashboard/super-admin/add-restaurant");
  };

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
        onClick={() => typeof number === 'number' && paginate(number)}
        className={`w-8 h-8 rounded-full ${
          currentPage === number
            ? "bg-primary text-white"
            : "bg-gray-200 text-gray-700 hover:bg-primary hover:text-white"
        }`}
        disabled={typeof number !== 'number'}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">
          {t("Manage Restaurants")}
        </h1>
        <button
          className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300"
          onClick={handleAddRestaurant}
        >
          <Plus size={16} className="mr-2" />
          {t("Add Restaurant")}
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="relative mb-4 md:mb-0 md:w-1/2">
          <input
            type="text"
            placeholder={t("Search restaurants...")}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-white border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <select
          className="w-full md:w-1/4 px-4 py-2 rounded-md bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-900 dark:border-slate-700 dark:text-white"
          value={filterCuisine}
          onChange={handleFilterChange}
        >
          <option value="all">{t("All Cuisines")}</option>
          <option value="Italian">{t("Italian")}</option>
          <option value="Japanese">{t("Japanese")}</option>
          <option value="Mexican">{t("Mexican")}</option>
          <option value="marocino">{t("Moroccan")}</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">{t("Loading restaurants...")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeInUp">
            {currentRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                restaurant={restaurant}
                onViewDetails={() => handleViewDetails(restaurant._id)}
                onDelete={handleDelete}  // This is the crucial part
                />
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
              {t("No restaurants found.")}
            </p>
          )}

          {filteredRestaurants.length > restaurantsPerPage && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500"
              >
                <ChevronLeft size={20} />
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageRestaurants;