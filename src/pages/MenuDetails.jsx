import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { getRequest } from "../utils/axiosRequests";
import { result } from 'lodash';



const MenuDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice,setTotalPrice] =useState(null);

  const dispatch = useDispatch();
 
 
// Fetching menu item data 
  useEffect(()=>{
    async function fetchData(){
      try{
        const uri =`menu-items/${id}`;
        const data = await getRequest(uri);
        setMenuItem(data.data.result);
        console.log(" az menuItem",);   
      }
      catch(error){
        console.error("Error fetching menu data:", error);
      }
    }
    fetchData();
  },[id]);

  console.log(menuItem);
// Calculating the total of the menu Item

  useEffect(()=>{
      if(menuItem){
        setTotalPrice(((menuItem.price) * quantity).toFixed(2));
      }
    },[menuItem,quantity]);

  // function add to cart
    const handleAddToCart = () =>{
      dispatch(addToCart({...menuItem,quantity}));
    }
  
  // function to update quantity
  
    const handleQuantityUpdate = (amount) => {
      const newQuantity = quantity + amount;
      if (newQuantity >= 1) {
        setQuantity(newQuantity);
      }
    };

    if (!menuItem) {
      return <div>{t("Loading...")}</div>;
    }

  return (
    <section className="py-10 md:py-20 lg:py-14 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row border border-slate-200 dark:border-slate-700 rounded-md p-4">
          <img
            src={`http://localhost:3005/${menuItem?.image}`}
            alt={menuItem?.name}
            className="w-full md:w-1/2 h-96 object-cover rounded-md"
          />
          <div className="md:ml-6 mt-4 md:mt-0 flex-1 space-y-4">
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-50">
              {menuItem?.name}
            </h1>
            <p className="text-slate-900 dark:text-slate-200 mb-4">
              {menuItem?.description}
            </p>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary">
                ${totalPrice}
              </span>
              <div className="flex items-center ml-4">
                <button
                  onClick={() => handleQuantityUpdate(-1)}
                  className="px-2 py-1 bg-gray-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded"
                >
                  <Minus size={18} />
                </button>
                <span className="mx-2 text-slate-900 dark:text-slate-50 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityUpdate(1)}
                  className="px-2 py-1 bg-gray-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
           
            
            <div className="flex space-x-4 mb-4">
              <button onClick={handleAddToCart} className="bg-primary text-white text-base font-semibold px-4 py-2 rounded-md hover:bg-primary/80 transition duration-300">
                {t("Add To Cart")} 
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuDetails;