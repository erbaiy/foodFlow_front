import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Grid, List, Filter } from "lucide-react";
import SpinnerIcon from "../components/SpinnerIcon";
import { getRequest } from "../utils/axiosRequests";
import { useDispatch } from "react-redux";
import { updateRestaurant, updateRestaurantAndClearCart } from "../store/cartSlice";
import { result } from "lodash";


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
  const dispatch =useDispatch();

  // Fetching menu items
  useEffect(() => {
    async function fetchData() {


      console.log('id of resto ',id)
      try {
        setIsLoading(true);
        const uri = `restaurants/${id}`;
        const data = await getRequest(uri);
        const result = data.data.result;
        
        // Set menu items from the menu array in the restaurant data
        setRestaurantData(result);
        setMenuItems(result.menu || []);
        
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    console.log('data',restaurantData)
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
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPrice && matchesSearch;
    });
  }, [priceRange, searchTerm, menuItems]);

  const visibleItems = filteredMenu.slice(0, visibleMenu);

  const uniqueCuisines = [...new Set(menuItems.map((item) => item.description))];

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

  if (isLoading && menuItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
       {console.log("loading")}
        <SpinnerIcon className="w-8 h-8" />
      </div>
    );
  }

  return (
  
    <section className="py-10 md:py-20 lg:py-14 bg-slate-50 dark:bg-slate-900">
      {console.log('end loding')}
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 flex">
        <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {menuItems.length > 0 && (
            <>
              <div className="relative h-64 md:h-80 overflow-hidden rounded-t-xl">
                {console.log('iconming image ',menuItems)}
                <img
  src={`http://localhost:3005/${restaurantData.banner}`}
  alt="Restaurant Cover"
  className="w-full h-full object-cover"
/>

                <div className="absolute inset-0"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
                  <img
                    src={`http://localhost:3005/${restaurantData?.logo}`}
                    alt="Restaurant Logo"
                    className="w-24 h-24 rounded-full border-4 border-white mr-4"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      {restaurantData?.name}
                    </h1>
                    <p className="text-xl text-white">
                      {restaurantData?.cuisineType}
                    </p>
                  </div>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <div className="grid grid-cols-4 gap-6">
                  <div className="col-span-3">
                    {menuItems && (
                      <MenuList
                        restaurantData={visibleItems}
                        viewMode={viewMode}
                        onMenuItemClick={handleMenuItemClick}
                      />
                    )}
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
                  <aside className="col-span-1 text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 p-4">
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
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// Update the MenuItemCard component with proper image URL handling
const MenuItemCard = ({ item, onMenuItemClick }) => {
  const { t } = useTranslation();
  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
    >
      <img
        src={`http://localhost:3005/${item.image}`}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {item.name}
        </h3>
        <p className="text-gray-600 dark:text-slate-300 mb-4">
          {item.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            ${item.price.toFixed(2)}
          </span>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition duration-300" 
            onClick={() => onMenuItemClick(item._id)}
          >
            {t("View Details")}
          </button>
        </div>
      </div>
    </div>
  );
};

// Update the MenuListItem component with proper image URL handling
const MenuListItem = ({ item, onMenuItemClick }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-slate-800 rounded-md shadow-md overflow-hidden transition duration-300 flex flex-col h-full">

      <div className="flex flex-col sm:flex-row h-full">

        <img
          src={`http://localhost:3005/${item.image}`}
          alt={item.name}
          className="w-full sm:w-40 h-48 sm:h-full object-cover"
        />
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">
            {item.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {item.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">
              ${item.price.toFixed(2)}
            </span>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition duration-300"
              onClick={() => onMenuItemClick(item._id)}
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
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurantData.map((item) => (
          <MenuItemCard key={item._id} item={item} onMenuItemClick={onMenuItemClick} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurantData.map((item) => (
          <MenuListItem key={item._id} item={item} onMenuItemClick={onMenuItemClick} />
        ))}
      </div>
    );
  }
};




// Keep SearchAndFilter, MenuList, MenuItemCard, and MenuListItem components the same

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  cuisineFilter,
  setCuisineFilter,
  uniqueCuisines,
  viewMode,
  visibleMenu,
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
              className="block p-2.5 w-full z-20 pl-10 text-sm text-slate-900 bg-slate-50 rounded-md border-slate-200  border focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none"
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
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setViewMode("grid")}
        >
          <Grid size={20} />

        </button>
        <button
          className={`p-2 rounded-lg ${
            viewMode === "list"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setViewMode("list")}
        >
          <List size={20} />
        </button>
      </div>
    </div>
  );
};




export default RestaurantDetails;
