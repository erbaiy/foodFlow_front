import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RestaurantHeader from "../../../components/RestaurantDetails/RestaurantHeader";
import MenuSection from "../../../components/RestaurantDetails/MenuSection";
import RestaurantInfoSection from "../../../components/RestaurantDetails/RestaurantInfoSection";
import axiosInstance from "../../../config/axios";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurantData, setRestaurantData] = useState(null);

  useEffect(() => {


    async function fetchData() {
      try {
        const uri = `super-admin/restaurants/${id}`;
        const data = await axiosInstance.get(uri);
        console.log("restaurantData youenss ", data);
        const result = data.data.data.result;
        setRestaurantData(result);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    }
    fetchData();
  }, [id]);

  if (!restaurantData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden">
      <RestaurantHeader restaurantData={restaurantData} />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MenuSection menu={restaurantData.menu} userRole="superAdmin" />
          <RestaurantInfoSection restaurantData={restaurantData} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
