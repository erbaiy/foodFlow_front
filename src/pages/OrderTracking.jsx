import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Package,
  Info,
  MapPin,
  User,
  Store,
  Truck,
} from "lucide-react";
import { getRequest } from "../utils/axiosRequests";

// Mise à jour des étapes pour correspondre exactement au modèle
const statusSteps = [
  {
    key: "pending",
    label: "Pending",
    description: "Your order has been placed.",
  },
  {
    key: "preparing",
    label: "Preparing",
    description: "Your order is being prepared.",
  },
  {
    key: "ready_for_delivery",
    label: "Ready for Delivery",
    description: "Your order is ready for delivery.",
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    description: "Your order is out for delivery.",
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Your order has been delivered.",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    description: "Your order has been cancelled.",
  },
];

const Stepper = ({ currentStep }) => (
  <ol className="relative text-slate-900 border-s border-slate-200 dark:border-slate-700 dark:text-slate-400">
    {statusSteps.map((step, index) => (
      <li key={step.key} className="mb-10 ms-6">
        <span
          className={`absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 shadow-md ${
            index <= currentStep
              ? "bg-green-500 dark:bg-green-900"
              : "bg-slate-300 dark:bg-slate-700"
          }`}
        >
          {index <= currentStep ? (
            <CheckCircle className="w-3.5 h-3.5 text-green-50 dark:text-green-500" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          )}
        </span>
        <h3 className="font-medium leading-tight text-slate-800 dark:text-slate-50">
          {step.label}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {step.description}
        </p>
      </li>
    ))}
  </ol>
);

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const uri =`orders/order/${orderId}`
      try{
        const response = await getRequest(uri);
        const fetchedOrder = response.order;
        setOrder(fetchedOrder);
      }
      catch(error){
        console.error("Error fetching order",error);
      }

    };
    fetchOrderDetails();
  }, [orderId]);

  console.log(order);
  if (!order) {
    return <div>Loading...</div>;
  }

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order.status
  );

  const totalAmount = order.items.reduce((acc, item) => {
    return acc + (item.menuItem?.price * item.quantity);
  }, 0);

  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900 md:py-20 lg:py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm p-10">
          <Stepper currentStep={currentStepIndex} />
        </div>
        <div className="lg:col-span-2 space-y-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm p-10">
          <div className="flex gap-8">
            {/* Order Status */}
            <div className="flex-1">
              <div className="relative h-32 bg-slate-50 dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex items-center space-x-4">
                <div className="absolute top-[-10px] left-[-10px] rounded-full bg-primary shadow-md p-2">
                  <Package size={22} className="text-slate-50" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-50">
                    Order Status
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {statusSteps[currentStepIndex].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="flex-1">
              <div className="relative h-32 bg-slate-50 dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex items-center space-x-4">
                <div className="absolute top-[-10px] left-[-10px] rounded-full bg-primary shadow-md p-2">
                  <User size={22} className="text-slate-50" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-50">
                    Client Information
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Name: {order.client?.fullName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Phone: {order.client?.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Restaurant Information */}
            <div className="flex-1">
              <div className="relative h-32 bg-slate-50 dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex items-center space-x-4">
                <div className="absolute top-[-10px] left-[-10px] rounded-full bg-primary shadow-md p-2">
                  <Store size={22} className="text-slate-50" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-50">
                    Restaurant Information
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Name: {order.restaurant?.name}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Address: {order.restaurant?.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="flex-1">
              <div className="relative h-32 bg-slate-50 dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex items-center space-x-4">
                <div className="absolute top-[-10px] left-[-10px] rounded-full bg-primary shadow-md p-2">
                  <MapPin size={22} className="text-slate-50" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-50">
                    Delivery Information
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold font-medium text-slate-800 dark:text-slate-50">
                      Address:{" "}
                    </span>
                    {order.client?.address}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold font-medium text-slate-800 dark:text-slate-50">
                      Estimated Delivery:
                    </span>
                    {/* {order.deliveryInfo.estimatedDelivery} */}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Delivery Person Information */}
            <div className="flex-1">
              {order.livreur && (
                <div className="relative h-32 bg-slate-50 dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex items-center space-x-4">
                  <div className="absolute top-[-10px] left-[-10px] rounded-full bg-primary shadow-md p-2">
                    <Truck size={22} className="text-slate-50" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-50">
                      Delivery Person
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Name: {order.livreur.name}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Phone: {order.livreur.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Timestamps */}
            <div className="flex-1">
              <div className="relative h-32 bg-slate-50 dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex items-center space-x-4">
                <div className="absolute top-[-10px] left-[-10px] rounded-full bg-primary shadow-md p-2">
                  <Info size={22} className="text-slate-50" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-50">
                    Order Timeline
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-50">
                      Created:{" "}
                    </span>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-50">
                      Last Updated:{" "}
                    </span>
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="relative bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-4 mb-4 absolute top-[-10px] left-[-10px]">
              <div className="rounded-full bg-primary dark:bg-primary-dark p-2 shadow-md">
                <Info size={22} className="text-white dark:text-slate-200" />
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
                Order Details
              </h2>
              <div className="overflow-x-auto rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                  <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      
                      <tr
                        key={index}
                        className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
                      >
                        {console.log("item",item)}
                        <td className="px-6 py-4 font-semibold text-base text-primary dark:text-primary-light whitespace-nowrap">
                          {item.menuItem?.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {item.menuItem?.description}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {item.menuItem?.price}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {item.quantity*item.menuItem?.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold bg-slate-100 dark:bg-slate-700">
                      <th
                        scope="row"
                        className="px-6 py-3 text-base text-slate-800 dark:text-white"
                        colSpan="4"
                      >
                        Total
                      </th>
                      <td className="px-6 py-3 text-slate-800 dark:text-white">
                        ${totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderTracking;
