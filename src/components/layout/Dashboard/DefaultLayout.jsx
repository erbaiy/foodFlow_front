import React, { Suspense, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { toggleSidebar } from "../../../store/themeConfigSlice";
import Header from "./Header";
import Setting from "./Setting";
import SuperAdminSidebar from "./SuperAdminSidebar";
import RestaurantManagerSidebar from "./RestaurantManagerSidebar";
import Portals from "./Portals";
import Loader from "../../Loader";
import DriverSideBar from "./DriverSidebar";

const DefaultLayout = ({ userRole }) => {
  const themeConfig = useSelector((state) => state.themeConfig);
  const dispatch = useDispatch();

  const [showLoader, setShowLoader] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onScrollHandler = () => {
    setShowTopButton(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", onScrollHandler);

    const screenLoader = document.querySelector(".screen_loader");
    if (screenLoader) {
      screenLoader.classList.add("animate__fadeOut");
      setTimeout(() => {
        setShowLoader(false);
      }, 200);
    }

    return () => {
      window.removeEventListener("scroll", onScrollHandler);
    };
  }, []);

  return (
    <div className="relative">
      {/* sidebar menu overlay */}
      <button
        className={`${
          (!themeConfig.sidebar && "hidden") || ""
        } fixed inset-0 bg-[black]/60 z-50 lg:hidden`}
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle Sidebar"
      ></button>

      {/* screen loader */}
      {showLoader && (
        <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
          <Loader />
        </div>
      )}

      <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-50">
        {showTopButton && (
          <button
            type="button"
            className="btn btn-outline-primary rounded-full p-2 animate-pulse bg-[#fafafa] dark:bg-[#060818] dark:hover:bg-primary"
            onClick={goToTop}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7l4-4m0 0l4 4m-4-4v18"
              />
            </svg>
          </button>
        )}
      </div>

      {/* BEGIN APP SETTING LAUNCHER */}
      {/* <Setting /> */}
      {/* END APP SETTING LAUNCHER */}

      <div
        className={`${themeConfig.navbar} main-container text-black dark:text-white-dark min-h-screen`}
      >
        {/* BEGIN SIDEBAR */}
        {(() => {
  switch (userRole) {
    case 'super_admin':
      return <SuperAdminSidebar />;
    case 'gestionnaire':
      return <RestaurantManagerSidebar />;
    case "livreur":
      return <DriverSideBar />;
    default:
      return null;
  }
})()}        {/* END SIDEBAR */}

        <div className="main-content flex flex-col min-h-screen">
          {/* BEGIN TOP NAVBAR */}
          <Header />
          {/* END TOP NAVBAR */}

          {/* BEGIN CONTENT AREA */}
          <Suspense fallback={<Loader />}>
            <div className={`${themeConfig.animation} p-6 animate__animated`}>
              <Outlet />
            </div>
          </Suspense>
          {/* END CONTENT AREA */}
          <Portals />
        </div>
      </div>
    </div>
  );
};

DefaultLayout.propTypes = {
  userRole: PropTypes.string.isRequired,
};

export default DefaultLayout;