import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart, updateQuantity } from "../store/cartSlice";
import { initializeOrder,insertOrder} from "../store/orderSlice";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const Cart = () => {
 
  const dispatch = useDispatch();
  const items = useSelector((state)=>state.cart.items);
  const totalAmount = useSelector((state)=>state.cart.totalAmount);
  const restaurant = useSelector((state)=>state.cart.restaurant);
  const client = useSelector((state)=>state.cart.client);

  const [isModalOpen,setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  



  const handleClearCart =() =>{
    dispatch(clearCart());
    toast.warning("Cart cleared");
  }



  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const handleUpdateQuantity = (id,quantity) => {
      const currentItem = items.find(item => item.id === id);
      if (currentItem && (currentItem.quantity + quantity) > 0) {
          dispatch(updateQuantity({id,quantity}));
      }
  }


  const calculateTotaPrice = (quantity,price) =>{
    return (quantity*price).toFixed(2);
  }

  const handleOrder = () =>{
    const orderData = {
      client,
      restaurant,
      items: items.map((item) => ({
          quantity: item.quantity,
          menuItem: item.id,
      })),
  };
    dispatch(initializeOrder(orderData));
    setIsModalOpen(true);
  }
  const handleConfirmOrder = () => {
    // Make sure client is a valid MongoDB ID string
    // MongoDB IDs are 24-character hexadecimal strings
    let clientId = client;
    

    
    // Handle if client is an object with _id property
    if (typeof client === 'object' && client !== null) {
      clientId = client.id;
    }
    
    // Ensure clientId is a string
    clientId = String(clientId);
    
    const orderData = {
      client: clientId,
      restaurant: typeof restaurant === 'object' ? String(restaurant._id) : String(restaurant),
      items: items.map(item => ({
        quantity: item.quantity,
        menuItem: typeof item.id === 'object' ? String(item.id._id) : String(item.id)
      }))
    };
    
    dispatch(insertOrder(orderData));  
    setIsModalOpen(false);
    navigate("/order-list");
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
};


  return (
    <section className="bg-slate-50 py-8 antialiased dark:bg-slate-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-50 sm:text-2xl">
          Shopping Cart
        </h2>
        {
          items.length == 0 ?(
            <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
                <p>Your cart is currently empty.</p>
            </div>
          )

        :(
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
    
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                >
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <a href="#" className="shrink-0 md:order-1">
                      <img
                        className="h-20 w-20 rounded-full"
                        src={`${import.meta.env.VITE_API_HOST}/uploads/restos/${item.image}`}
                        alt={item.name}
                      />
                    </a>
                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <a
                        href="#"
                        className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                      >
                        {item.name}
                      </a>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <svg
                            className="me-1.5 h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18 17.94 6M18 18 6.06 6"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={()=>handleUpdateQuantity(item.id,-1)}
                            className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                          >
                            <svg
                              className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 2"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h16"
                              />
                            </svg>
                          </button>
                          <input
                            type="text"
                            readOnly
                            value={item.quantity}
                            className="w-10 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={()=>handleUpdateQuantity(item.id,1)}
                            className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                          >
                            <svg
                              className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 18"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 1v16M1 9h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    <div className="text-end md:order-4 md:w-32">
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        ${calculateTotaPrice(item.quantity,item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Order Summary
              </p>
              <div className="space-y-4">
                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">
                    ${totalAmount}
                  </dd>
                </dl>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleOrder}
                  className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white"
                >
                  Order Now
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex w-full items-center justify-center border-2 text-red-500 border-red-500 hover:bg-red-500 hover:text-slate-50 font-semibold rounded-md bg-slate-50 px-5 py-2.5 text-sm">
                  Clear All 
                </button>
                <ConfirmationModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  onConfirm={handleConfirmOrder}
                  title="Confirm  Order"
                  message="Are you sure you want to confirm order?"
                />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default Cart;