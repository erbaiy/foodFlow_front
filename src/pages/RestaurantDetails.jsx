import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Grid, List, Filter, AlertCircle } from "lucide-react";
import SpinnerIcon from "../components/SpinnerIcon";
import { getRequest } from "../utils/axiosRequests";
import { useDispatch } from "react-redux";
import { updateRestaurantAndClearCart } from "../store/cartSlice";

// Default placeholder image as base64
const DEFAULT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBElEQVR4nO3dMUpEQRRF0bJxD26huzCwE3f+wVagIIIgiCCYiAZOYDAy9KnzDpxyBPfne0AIkiRJkiRJkiRJkiRJkiRp3i5xintc4QGvJb/5ynOxN5zjI77LN0/ZG27wU745slfcldzlG9/FB5azN9xiU3LV50L2hLWS370VH+O4sZaNkl89FB/itLGWS7yV/Oqr+AhXxQeWM8Rrya8eiw9w0VjLer7LN8VHuG6sZT1f5TfFR7hprKXkWvNs5O94xnf55mQv2Sv5z2v25pKSJEmSJOl/A8MuQZcQS3CAL9Bv69eww6Jf/y85wA6LAuxD+8PZUvP/soEsNECSpG78AHbMNCEfVQnOAAAAAElFTkSuQmCC";

// Helper function to safely get image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return DEFAULT_IMAGE;
  return `http://localhost:3005/${imagePath}`;
};

const RestaurantDetails = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ from: "", to: "" });
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState(6);
  const [restaurantData, setRestaurantData] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]); 
  const dispatch = useDispatch();

  // Fetching menu items
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const uri = `restaurants/${id}`;
        const data = await getRequest(uri);
        const result = data?.data?.result;
        
        // Validate that we have the required data
        if (!result) {
          console.error(`No data found for restaurant ID: ${id}`);
          setRestaurantData(null);
          setMenuItems([]);
          return;
        }
        
        console.log("Restaurant data:", result);
        setRestaurantData(result);
        
        // Ensure menu items is always an array
        const menuData = Array.isArray(result.menu) ? result.menu : [];
        setMenuItems(menuData);
        
      } catch (error) {
        console.error(`Error fetching restaurant ID ${id}:`, error);
        setRestaurantData(null);
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);
  
  const handleMenuItemClick = (itemId) => {
    dispatch(updateRestaurantAndClearCart(id));
    navigate(`/menu-details/${itemId}`);
  };

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesPrice =
        (priceRange.from === "" || item.price >= parseFloat(priceRange.from)) &&
        (priceRange.to === "" || item.price <= parseFloat(priceRange.to));
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      return matchesPrice && matchesSearch;
    });
  }, [priceRange, searchTerm, menuItems]);

  const visibleItems = filteredMenu.slice(0, visibleMenu);

  const uniqueCuisines = [...new Set(menuItems.map((item) => item.description || ""))];

  const handlePriceChange = (e) => {
    const { id, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [id]: value }));
  };

  const handleViewMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleMenu((prev) => prev + 6);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading && !restaurantData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinnerIcon className="w-8 h-8" />
      </div>
    );
  }

  return (
    <section className="py-10 md:py-20 lg:py-14 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 flex">
        <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {isLoading && !menuItems.length ? (
            <div className="flex justify-center items-center h-64">
              <SpinnerIcon className="w-8 h-8" />
            </div>
          ) : restaurantData ? (
            <>
              <div className="relative h-64 md:h-80 overflow-hidden rounded-t-xl">
                <img
                  src={getImageUrl(restaurantData?.banner)}
                  alt="Restaurant Cover"
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.src = DEFAULT_IMAGE}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
                  <img
                    src={getImageUrl(restaurantData?.logo)}
                    alt="Restaurant Logo"
                    className="w-24 h-24 rounded-full border-4 border-white mr-4"
                    onError={(e) => {e.target.src = DEFAULT_IMAGE}}
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      {restaurantData?.name || t("Restaurant")}
                    </h1>
                    <p className="text-xl text-white">
                      {restaurantData?.cuisineType || t("Various Cuisines")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {menuItems && menuItems.length > 0 ? (
                  <>
                    <SearchAndFilter
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      cuisineFilter={cuisineFilter}
                      setCuisineFilter={setCuisineFilter}
                      uniqueCuisines={uniqueCuisines}
                      viewMode={viewMode}
                      visibleMenu={visibleMenu}
                      setViewMode={setViewMode}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-3">
                        <MenuList
                          restaurantData={visibleItems}
                          viewMode={viewMode}
                          onMenuItemClick={handleMenuItemClick}
                        />
                        {visibleMenu < filteredMenu.length && (
                          <div className="mt-8 flex justify-center">
                            <button
                              onClick={handleViewMore}
                              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-300 flex items-center"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <SpinnerIcon className="w-5 h-5 mr-2" />
                                  {t("Loading...")}
                                </>
                              ) : (
                                t("View More")
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      <aside className="md:col-span-1 text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Filter size={20} />
                          <h2 className="text-base font-semibold">{t("Filter by")}</h2>
                        </div>
                        <div className="flex flex-col items-center gap-4 rounded-md p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <div>
                            <h3 className="text-sm font-semibold">{t("Price")}</h3>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center justify-center">
                              <input
                                id="from"
                                type="number"
                                value={priceRange.from}
                                onChange={handlePriceChange}
                                className="border border-gray-300 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-50 text-sm font-medium rounded-full w-full py-2 px-4 focus:outline-none"
                                placeholder={t("From")}
                                min="0"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                id="to"
                                type="number"
                                value={priceRange.to}
                                onChange={handlePriceChange}
                                className="border border-gray-300 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-50 text-sm font-medium rounded-full w-full py-2 px-4 focus:outline-none"
                                placeholder={t("To")}
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      </aside>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-auto max-w-md dark:bg-yellow-900/20 dark:border-yellow-800">
                      <div className="flex items-center justify-center mb-4">
                        <AlertCircle className="text-yellow-500 w-8 h-8 mr-2" />
                        <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400">
                          {t("No Menu Available")}
                        </h3>
                      </div>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        {t("This restaurant hasn't uploaded their menu yet. Please check back later or contact the restaurant directly.")}
                      </p>
                      <button
                        onClick={() => navigate('/restaurants')}
                        className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300"
                      >
                        {t("Back to Restaurants")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-auto max-w-md dark:bg-red-900/20 dark:border-red-800">
                <div className="flex items-center justify-center mb-4">
                  <AlertCircle className="text-red-500 w-8 h-8 mr-2" />
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                    {t("Restaurant Not Found")}
                  </h3>
                </div>
                <p className="text-red-700 dark:text-red-300">
                  {t("We couldn't find the restaurant you're looking for. It may have been removed or unavailable.")}
                </p>
                <button
                  onClick={() => navigate('/restaurants')}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300"
                >
                  {t("Back to Restaurants")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Updated MenuItemCard component with error handling
const MenuItemCard = ({ item, onMenuItemClick }) => {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <img
        src={item?.image ? `http://localhost:3005/${item.image}` : DEFAULT_IMAGE}
        alt={item?.name}
        className="w-full h-48 object-cover"
        onError={(e) => {e.target.src = DEFAULT_IMAGE; setImgError(true)}}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {item?.name || t("Unnamed Item")}
        </h3>
        <p className="text-gray-600 dark:text-slate-300 mb-4">
          {item?.description || t("No description available")}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            ${typeof item?.price === 'number' ? item.price.toFixed(2) : "0.00"}
          </span>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition duration-300" 
            onClick={() => onMenuItemClick(item?._id)}
          >
            {t("View Details")}
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated MenuListItem component with error handling
const MenuListItem = ({ item, onMenuItemClick }) => {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-md shadow-md overflow-hidden transition duration-300 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row h-full">
        <img
          src={item?.image ? `http://localhost:3005/${item.image}` : DEFAULT_IMAGE}
          alt={item?.name}
          className="w-full sm:w-40 h-48 sm:h-full object-cover"
          onError={(e) => {e.target.src = DEFAULT_IMAGE; setImgError(true)}}
        />
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">
            {item?.name || t("Unnamed Item")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {item?.description || t("No description available")}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-2xl font-bold text-primary">
              ${typeof item?.price === 'number' ? item.price.toFixed(2) : "0.00"}
            </span>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition duration-300"
              onClick={() => onMenuItemClick(item?._id)}
            >
              {t("View Details")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuList = ({ restaurantData, viewMode, onMenuItemClick }) => {
  const { t } = useTranslation();
  
  if (!restaurantData || restaurantData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {t("No menu items match your search criteria")}
      </div>
    );
  }
  
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurantData.map((item) => (
          <MenuItemCard key={item?._id || `item-${Math.random()}`} item={item} onMenuItemClick={onMenuItemClick} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurantData.map((item) => (
          <MenuListItem key={item?._id || `item-${Math.random()}`} item={item} onMenuItemClick={onMenuItemClick} />
        ))}
      </div>
    );
  }
};

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  cuisineFilter,
  setCuisineFilter,
  uniqueCuisines,
  viewMode,
  setViewMode,
}) => {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (cuisine) => {
    setCuisineFilter(cuisine);
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between mb-6">
      <div className="relative mb-4 md:mb-0 md:w-3/4">
        <div className="flex">
          <div className="relative w-full">
            <input
              type="search"
              className="block p-2.5 w-full z-20 pl-10 text-sm text-slate-900 bg-slate-50 rounded-md border-slate-200 border focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none"
              placeholder={t("Search Menu...")}
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className={`p-2 rounded-lg ${
            viewMode === "grid"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-300"
          }`}
          onClick={() => setViewMode("grid")}
          aria-label="Grid view"
        >
          <Grid size={20} />
        </button>
        <button
          className={`p-2 rounded-lg ${
            viewMode === "list"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-300"
          }`}
          onClick={() => setViewMode("list")}
          aria-label="List view"
        >
          <List size={20} />
        </button>
      </div>
    </div>
  );
};

export default RestaurantDetails;