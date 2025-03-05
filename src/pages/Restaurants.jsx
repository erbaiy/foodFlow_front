import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Grid, List, ChevronDown, MapPin } from "lucide-react";
import RestaurantIllustration from "../assets/img/restaurants-illustration.svg";
import SpinnerIcon from "../components/SpinnerIcon";
import { getRequest } from "../utils/axiosRequests";
import { useNavigate } from "react-router-dom";

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

const Restaurants = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [visibleRestaurants, setVisibleRestaurants] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
           const uri = "restaurants/";
            const response = await getRequest(uri);
            console.log('incoming resto data', response.data.result);
            if(Array.isArray(response.data.result)){
                setRestaurants(response.data.result);
            } else {
                console.error("API response data is not an array:", response.data.result)
                setRestaurants([])
            }

        } catch (error) {
            console.error("Error fetching restaurants: ", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
}, []);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCuisine =
        cuisineFilter === "" || restaurant.cuisineType === cuisineFilter;
      return matchesSearch && matchesCuisine;
    });
  }, [searchTerm, cuisineFilter, restaurants]);

  const uniqueCuisines = useMemo(() => {
    return [...new Set(restaurants.map((restaurant) => restaurant.cuisineType))];
  }, [restaurants]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <HeroSection />
      <RestaurantSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cuisineFilter={cuisineFilter}
        setCuisineFilter={setCuisineFilter}
        uniqueCuisines={uniqueCuisines}
        filteredRestaurants={filteredRestaurants}
        viewMode={viewMode}
        setViewMode={setViewMode}
        visibleRestaurants={visibleRestaurants}
        setVisibleRestaurants={setVisibleRestaurants}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-10 md:py-20 lg:py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-4xl xl:text-5xl">
              {t("Discover the Best Restaurants Around You")}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-justify text-gray-500 dark:text-gray-300 md:mt-5 md:max-w-2xl">
              {t(
                "Explore a curated selection of top-rated restaurants in your area. From local favorites to international cuisines, find the perfect dining experience for every occasion."
              )}
            </p>
          </div>
          <div className="mt-12 relative sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <img
              src={RestaurantIllustration}
              alt="home illustration"
              className="w-full h-[18rem] lg:h-[18rem] lg:max-w-xl mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const RestaurantSection = ({
  searchTerm,
  setSearchTerm,
  cuisineFilter,
  setCuisineFilter,
  uniqueCuisines,
  filteredRestaurants,
  viewMode,
  setViewMode,
  visibleRestaurants,
  setVisibleRestaurants,
  isLoading,
  setIsLoading,
}) => {
  const { t } = useTranslation();

  const handleViewMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleRestaurants((prev) => prev + 8);
      setIsLoading(false);
    }, 1000);
  }, [setIsLoading, setVisibleRestaurants]);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          cuisineFilter={cuisineFilter}
          setCuisineFilter={setCuisineFilter}
          uniqueCuisines={uniqueCuisines}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <RestaurantList
          restaurants={filteredRestaurants.slice(0, visibleRestaurants)}
          viewMode={viewMode}
        />
        {visibleRestaurants < filteredRestaurants.length && (
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
    </section>
  );
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
          <button
            id="dropdown-button"
            className="flex-shrink-0 inline-flex items-center rounded-l-md py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-md hover:bg-gray-200 focus:ring-2 focus:ring-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none"
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {cuisineFilter === "" ? t("All Cuisines") : t(cuisineFilter)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 z-10 bg-white divide-y divide-gray-100 rounded-md shadow w-44 dark:bg-gray-700">
              <ul className="scroll py-2 text-sm text-slate-700 dark:text-slate-200 max-h-60 overflow-y-auto">
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => handleFilterChange("")}
                  >
                    {t("All Cuisines")}
                  </button>
                </li>
                {uniqueCuisines.map((cuisine) => (
                  <li key={cuisine}>
                    <button
                      type="button"
                      className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => handleFilterChange(cuisine)}
                    >
                      {t(cuisine)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="relative w-full">
            <input
              type="search"
              className="block p-2.5 w-full z-20 text-sm text-slate-900 bg-slate-50 rounded-e-md border-s-gray-50 border-s-2 border-l-0 border border-slate-300 focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none"
              placeholder={t("Search restaurants...")}
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-md ${viewMode === "grid" ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          <Grid size={24} />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-md ${viewMode === "list" ? "bg-primary text-white" : "bg-gray-200"}`}
        >
          <List size={24} />
        </button>
      </div>
    </div>
  );
};

const RestaurantList = ({ restaurants, viewMode }) => {
  const navigate = useNavigate();

  const handleNavigation = (id) => {

   
    navigate(`/restaurant-details/${id}`);
  };

  if (restaurants.length === 0) {
    return <p>No restaurants found.</p>;
  }
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id || restaurant.id} restaurant={restaurant} handleNavigation={handleNavigation} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantListItem key={restaurant._id || restaurant.id} restaurant={restaurant} handleNavigation={handleNavigation} />
        ))}
      </div>
    );
  }
};

const RestaurantCard = ({ restaurant, handleNavigation }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gradient-to-t from-orange-100 to-transparent dark:bg-gradient-to-t dark:from-slate-800 dark:to-transparent rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition duration-300">
      <div className="flex flex-col items-center pt-4">
        <img
          src={getImageUrl(restaurant.logo)}
          alt={restaurant.name}
          className="w-24 h-24 mb-3 rounded-full shadow-md object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/100";
          }}
        />
        <h3 className="text-xl font-semibold mb-2 dark:text-white">
          {restaurant.name}
        </h3>
        <p className="text-slate-50 font-medium rounded-full bg-primary px-2 py-1 dark:text-gray-300 mb-2">
          {t(restaurant.cuisineType)}
        </p>
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
          <MapPin size={16} className="mr-1" />
          <p className="text-sm">{restaurant.address}</p>
        </div>
      </div>
      <div className="p-4">
        <button 
          onClick={() => handleNavigation(restaurant._id || restaurant.id)} 
          className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-dark transition duration-300"
        >
          {t("View Menu")}
        </button>
      </div>
    </div>
  );
};

const RestaurantListItem = ({ restaurant, handleNavigation }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-slate-800 rounded-md shadow-md overflow-hidden transition duration-300 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row h-full">
        <img
          src={getImageUrl(restaurant.logo)}
          alt={restaurant.name}
          className="w-full sm:w-40 h-48 sm:h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/160x200";
          }}
        />
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">
            {restaurant.name}
          </h3>
          <p className="text-slate-50 font-medium rounded-full w-fit bg-primary px-2 py-1 dark:text-gray-300 mb-2">
            {t(restaurant.cuisineType)}
          </p>
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
            <MapPin size={16} className="mr-1 flex-shrink-0" />
            <p className="text-sm">{restaurant.location}</p>
          </div>
          <div className="mt-auto">
            <button 
              onClick={() => handleNavigation(restaurant._id || restaurant.id)} 
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300"
            >
              {t("View Menu")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;


































// import { useState, useMemo, useCallback, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Search, Grid, List, ChevronDown, MapPin } from "lucide-react";
// import RestaurantIllustration from "../assets/img/restaurants-illustration.svg";
// import SpinnerIcon from "../components/SpinnerIcon";
// import { getRequest } from "../utils/axiosRequests";
// import { useNavigate } from "react-router-dom";


// const Restaurants = () => {
//   const { t } = useTranslation();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [cuisineFilter, setCuisineFilter] = useState("");
//   const [viewMode, setViewMode] = useState("grid");
//   const [visibleRestaurants, setVisibleRestaurants] = useState(8);
//   const [isLoading, setIsLoading] = useState(false);
//   const [restaurants, setRestaurants] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//         setIsLoading(true);
//         try {
//            const uri = "restaurants/";
//             const response = await getRequest(uri);
//             console.log('incoming resto data', response.data.result);
//             if(Array.isArray(response.data.result)){
//                 setRestaurants(response.data.result);
//             } else {
//                 console.error("API response data is not an array:", response.data.result)
//                 setRestaurants([])
//             }

//         } catch (error) {
//             console.error("Error fetching restaurants: ", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     fetchData();
// }, []);

//   const filteredRestaurants = useMemo(() => {
//     return restaurants.filter((restaurant) => {
//       const matchesSearch =
//         restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesCuisine =
//         cuisineFilter === "" || restaurant.cuisineType === cuisineFilter;
//       return matchesSearch && matchesCuisine;
//     });
//   }, [searchTerm, cuisineFilter, restaurants]);

//   const uniqueCuisines = useMemo(() => {
//     return [...new Set(restaurants.map((restaurant) => restaurant.cuisineType))];
//   }, [restaurants]);

//   return (
//     <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
//       <HeroSection />
//       <RestaurantSection
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         cuisineFilter={cuisineFilter}
//         setCuisineFilter={setCuisineFilter}
//         uniqueCuisines={uniqueCuisines}
//         filteredRestaurants={filteredRestaurants}
//         viewMode={viewMode}
//         setViewMode={setViewMode}
//         visibleRestaurants={visibleRestaurants}
//         setVisibleRestaurants={setVisibleRestaurants}
//         isLoading={isLoading}
//         setIsLoading={setIsLoading}
//       />
//     </div>
//   );
// };

// const HeroSection = () => {
//   const { t } = useTranslation();
//   return (
//     <section className="py-10 md:py-20 lg:py-14">
//       <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
//         <div className="lg:flex lg:items-center lg:justify-between">
//           <div className="max-w-xl space-y-8">
//             <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-4xl xl:text-5xl">
//               {t("Discover the Best Restaurants Around You")}
//             </h1>
//             <p className="mt-3 max-w-md mx-auto text-base text-justify text-gray-500 dark:text-gray-300 md:mt-5 md:max-w-2xl">
//               {t(
//                 "Explore a curated selection of top-rated restaurants in your area. From local favorites to international cuisines, find the perfect dining experience for every occasion."
//               )}
//             </p>
//           </div>
//           <div className="mt-12 relative sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
//             <img
//               src={RestaurantIllustration}
//               alt="home illustration"
//               className="w-full h-[18rem] lg:h-[18rem] lg:max-w-xl mx-auto"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const RestaurantSection = ({
//   searchTerm,
//   setSearchTerm,
//   cuisineFilter,
//   setCuisineFilter,
//   uniqueCuisines,
//   filteredRestaurants,
//   viewMode,
//   setViewMode,
//   visibleRestaurants,
//   setVisibleRestaurants,
//   isLoading,
//   setIsLoading,
// }) => {
//   const { t } = useTranslation();

//   const handleViewMore = useCallback(() => {
//     setIsLoading(true);
//     setTimeout(() => {
//       setVisibleRestaurants((prev) => prev + 8);
//       setIsLoading(false);
//     }, 1000);
//   }, [setIsLoading, setVisibleRestaurants]);

//   return (
//     <section className="py-12">
//       <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
//         <SearchAndFilter
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           cuisineFilter={cuisineFilter}
//           setCuisineFilter={setCuisineFilter}
//           uniqueCuisines={uniqueCuisines}
//           viewMode={viewMode}
//           setViewMode={setViewMode}
//         />
//         <RestaurantList
//           restaurants={filteredRestaurants.slice(0, visibleRestaurants)}
//           viewMode={viewMode}
//         />
//         {visibleRestaurants < filteredRestaurants.length && (
//           <div className="mt-8 flex justify-center">
//             <button
//               onClick={handleViewMore}
//               className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-300 flex items-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <SpinnerIcon className="w-5 h-5 mr-2" />
//                   {t("Loading...")}
//                 </>
//               ) : (
//                 t("View More")
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// const SearchAndFilter = ({
//   searchTerm,
//   setSearchTerm,
//   cuisineFilter,
//   setCuisineFilter,
//   uniqueCuisines,
//   viewMode,
//   setViewMode,
// }) => {
//   const { t } = useTranslation();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterChange = (cuisine) => {
//     setCuisineFilter(cuisine);
//     setDropdownOpen(false);
//   };



//   return (
//     <div className="flex flex-col md:flex-row justify-between mb-6">
//       <div className="relative mb-4 md:mb-0 md:w-3/4">
//         <div className="flex">
//           <button
//             id="dropdown-button"
//             className="flex-shrink-0 inline-flex items-center rounded-l-md py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-md hover:bg-gray-200 focus:ring-2 focus:ring-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none"
//             type="button"
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           >
//             {cuisineFilter === "" ? t("All Cuisines") : t(cuisineFilter)}
//             <ChevronDown className="w-4 h-4 ml-2" />
//           </button>
//           {dropdownOpen && (
//             <div className="absolute top-full left-0 z-10 bg-white divide-y divide-gray-100 rounded-md shadow w-44 dark:bg-gray-700">
//               <ul className="scroll py-2 text-sm text-slate-700 dark:text-slate-200 max-h-60 overflow-y-auto">
//                 <li>
//                   <button
//                     type="button"
//                     className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                     onClick={() => handleFilterChange("")}
//                   >
//                     {t("All Cuisines")}
//                   </button>
//                 </li>
//                 {uniqueCuisines.map((cuisine) => (
//                   <li key={cuisine}>
//                     <button
//                       type="button"
//                       className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
//                       onClick={() => handleFilterChange(cuisine)}
//                     >
//                       {t(cuisine)}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           <div className="relative w-full">
//             <input
//               type="search"
//               className="block p-2.5 w-full z-20 text-sm text-slate-900 bg-slate-50 rounded-e-md border-s-gray-50 border-s-2 border-l-0 border border-slate-300 focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none"
//               placeholder={t("Search restaurants...")}
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//             <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
//           </div>
//         </div>
//       </div>
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={() => setViewMode("grid")}
//           className={`p-2 rounded-md ${viewMode === "grid" ? "bg-primary text-white" : "bg-gray-200"}`}
//         >
//           <Grid size={24} />
//         </button>
//         <button
//           onClick={() => setViewMode("list")}
//           className={`p-2 rounded-md ${viewMode === "list" ? "bg-primary text-white" : "bg-gray-200"}`}
//         >
//           <List size={24} />
//         </button>
//       </div>
//     </div>
//   );
// };


// const RestaurantList = ({ restaurants, viewMode }) => {
//   const navigate = useNavigate();

//   const handleNavigation=(id)=>{
//     navigate(`/restaurant-details/${id}`);
//   }


//   if (restaurants.length === 0) {
//     return <p>No restaurants found.</p>;
//   }
//   if (viewMode === "grid") {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {restaurants.map((restaurant) => (
//           <RestaurantCard key={restaurant.id} restaurant={restaurant} handleNavigation={handleNavigation}  />
//         ))}
//       </div>
//     );
//   } 
//   else {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {restaurants.map((restaurant) => (
//           <RestaurantListItem key={restaurant.id} restaurant={restaurant} handleNavigation={handleNavigation}  />
//         ))}
//       </div>
//     );
//   }
// };

// const RestaurantCard = ({ restaurant,handleNavigation }) => {
//   const { t } = useTranslation();
  
//   return (
//     <div className="bg-gradient-to-t from-orange-100 to-transparent dark:bg-gradient-to-t dark:from-slate-800 dark:to-transparent rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition duration-300">
//       <div className="flex flex-col items-center pt-4">
//         <img
//           src={restaurant.logo?`${import.meta.env.VITE_API_HOST}/${restaurant.logo}`:""}

//           alt={restaurant.name}
//           className="w-24 h-24 mb-3 rounded-full shadow-md"
//         />
//         <h3 className="text-xl font-semibold mb-2 dark:text-white">
//           {restaurant.name}
//         </h3>
//         <p className="text-slate-50 font-medium rounded-full bg-primary px-2 py-1 dark:text-gray-300 mb-2">
//           {t(restaurant.cuisineType)}
//         </p>
//         <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
//           <MapPin size={16} className="mr-1" />
//           <p className="text-sm">{restaurant.address}</p>
//         </div>
//       </div>
//       <div className="p-4">
//         <button onClick={()=>handleNavigation(restaurant._id)} className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-dark transition duration-300">
//           {t("View Menu")}
//         </button>
//       </div>
//     </div>
//   );
// };

// const RestaurantListItem = ({ restaurant,handleNavigation}) => {
//   const { t } = useTranslation();
//   return (
//     <div className="bg-white dark:bg-slate-800 rounded-md shadow-md overflow-hidden transition duration-300 flex flex-col h-full">
//       <div className="flex flex-col sm:flex-row h-full">
      
//         <img
//           src={restaurant.logo?`${import.meta.env.VITE_API_HOST}/${restaurant.logo}`:""}
//           className="w-full sm:w-40 h-48 sm:h-full object-cover"
//         />
//         <div className="p-4 flex flex-col flex-grow">
//           <h3 className="text-xl font-semibold mb-2 dark:text-white">
//             {restaurant.name}
//           </h3>
//           <p className="text-slate-50 font-medium rounded-full w-fit bg-primary px-2 py-1 dark:text-gray-300 mb-2">
//             {t(restaurant.cuisineType)}
//           </p>
//           <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
//             <MapPin size={16} className="mr-1 flex-shrink-0" />
//             <p className="text-sm">{restaurant.location}</p>
//           </div>
//           <div className="mt-auto">
//             <button onClick={()=>handleNavigation(restaurant.id)} className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300">
//               {t("View Menu")}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Restaurants;
