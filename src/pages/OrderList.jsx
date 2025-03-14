// src/pages/OrderList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, XCircle } from 'lucide-react'; // Importing icons from Lucide
import { getRequest } from "../utils/axiosRequests";
import { useSelector } from "react-redux";
import { loadState } from "../utils/localStorage";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const user = useSelector(state => state.order.client) || JSON.parse(localStorage.getItem('user'));
  const userId = user.id;



  useEffect(() => {

     const clientId=userId;
     const fetchData = async () => {
      const uri=`client/orders/${clientId}`;
      try{
        const response = await getRequest(uri);
        const fetchedOrders = response;
        console.log("fetchedorders",fetchedOrders);
        setOrders(fetchedOrders);
      }
      catch(error){
        console.error("error fetching order",error);
      }
     }
    fetchData();
  }, [userId]);



  {console.log("userId",userId)}

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'preparing':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'ready_for_delivery':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'out_for_delivery':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    let color;
    switch (status) {
      case 'pending':
        color = 'bg-yellow-500 rounded-full text-slate-50';
        break;
      case 'preparing':
        color = 'bg-blue-500 rounded-full text-slate-50';
        break;
      case 'ready_for_delivery':
      case 'out_for_delivery':
      case 'delivered':
        color = 'bg-green-500 rounded-full text-slate-50';
        break;
      case 'cancelled':
        color = 'bg-red-500 rounded-full text-slate-50';
        break;
      default:
        color = 'bg-gray-500 rounded-full text-slate-50';
    }
    return <span className={`px-2 py-1 text-xs font-semibold rounded ${color}`}>{status}</span>;
  };

  return (
    <section className="py-10 bg-slate-50 dark:bg-slate-900 md:py-20 lg:py-14">
      <div className="max-w-7xl border border-slate-200 dark:border-slate-700 rounded-md p-8 mx-auto px-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-50">Your Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/order-tracking/${order._id}`}
              className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md flex items-center transition duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="mr-4">
                {getStatusIcon(order.status)}
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-lg">Order #{order._id}</p>
                <p className="text-slate-900 dark:text-slate-50 text-sm font-semibold">Status: {getStatusBadge(order.status)}</p>
                <p className="text-slate-900 dark:text-slate-50 text-sm font-semibold">Date: <span className="text-slate-500 dark:text-slate-50 text-sm font-normal">{new Date(order.createdAt).toLocaleString()}</span></p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderList;