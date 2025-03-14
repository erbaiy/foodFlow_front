import React from 'react';
import { Link } from 'react-router-dom'; 
import NotFoundImage from "../assets/img/404.svg";

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 backdrop-blur-lg px-6 py-10 sm:px-16">
      <div className="relative w-full max-w-[750px] rounded-md">
        <div className="relative flex flex-col justify-center rounded-md backdrop-blur-lg px-6 lg:min-h-[500px] py-10">
          <div className="mx-auto w-full max-w-[500px] text-center">
            <img src={NotFoundImage} alt="404" className="mx-auto mb-4" />
            <p className="text-lg font-semibold leading-normal text-slate-700 dark:text-slate-50 mb-6">
              Oops! The page you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-block rounded-md px-5 py-2 text-sm bg-orange-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 justify-center font-semibold outline-none transition duration-300 hover:shadow-none text-white !mt-6 border-0 shadow-[0_10px_20px_-10px_rgba(249,115,22,1)]">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;