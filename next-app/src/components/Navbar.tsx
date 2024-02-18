/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState, useCallback } from "react";

// context
import AppContext from "@/context/AppContext";

const Navbar = () => {
  const {
    socketConnection,
    setModal,
    darkMode,
    toggleDarkMode,
    user,
    initialLoad,
    mobile,
  } = useContext(AppContext);

  return !socketConnection?.connected ? (
    <div
      className={`${
        user?.name &&
        "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto transition-opacity"
      } absolute top-8 right-8 h-10 w-10 flex justify-center items-center select-none`}
    >
      {!initialLoad && (
        <button
          className={`${
            mobile
              ? "active:scale-90 active:bg-black/75"
              : "hover:scale-90 hover:bg-black/75"
          } w-full h-full cursor-pointer transition-all bg-black/50 z-50 rounded-full animate-fade-in-fast`}
          onClick={toggleDarkMode}
        >
          <i
            className={`${
              darkMode ? "fa-moon text-purple-500" : "fa-sun text-yellow-600"
            } fa-solid text-lg`}
          />
        </button>
      )}
    </div>
  ) : (
    <div className="h-14 w-full flex justify-between bg-blue-600 dark:bg-black shrink-0 text-white px-5 select-none">
      <div className="h-full flex items-center">
        <div
          className={`${
            mobile ? "active:opacity-100" : "hover:opacity-100"
          } flex group cursor-pointer opacity-80 transition-opacity`}
          onClick={() => setModal("credits")}
        >
          <div className="hidden sm:block mr-[.6rem]">
            <img className="w-[1.4rem]" src="/socketio.png" alt="logo" />
          </div>
          <div>SocketChat</div>
        </div>
      </div>
      <div className="flex">
        <div className="h-full flex items-center px-4 xl:px-5 md:text-xs lg:text-sm xl:text-base">
          <div
            className={`${
              mobile ? "active:text-white" : "hover:text-white"
            } relative cursor-pointer text-white/80 transition-colors`}
            onClick={() => setModal("messages")}
          >
            <span className="block md:hidden">
              <i className={`fa-regular fa-comment text-lg`} />
              <div className="w-3 h-3 md:w-[.8rem] md:h-[.8rem] bg-red-600 dark:bg-red-700 absolute -top-1 md:-top-1.5 right-1.5 md:-right-0.5 rounded-full animate-cart-bounce flex justify-center items-center text-[.5rem] md:text-[.55rem] font-extrabold md:font-bold dark:text-black">
                <div>2</div>
              </div>
            </span>
            <span className="hidden md:block z-10">conversations</span>
          </div>
        </div>
        <div className="h-full flex items-center px-4 xl:px-5 md:text-xs lg:text-sm xl:text-base">
          <div
            className={`${
              mobile ? "active:text-white" : "hover:text-white"
            } cursor-pointer text-white/80 transition-colors`}
            onClick={() => setModal("active users")}
          >
            <span className="relative block md:hidden">
              <div className="w-[.3rem] h-[.3rem] bg-green-500 absolute -top-0.5 right-0 translate-x-full rounded-full" />
              <i className={`fa-regular fa-user text-lg`} />
            </span>
            <span className="hidden md:block">connected users</span>
          </div>
        </div>

        <div className="h-full flex items-center px-4 xl:px-5 md:text-xs lg:text-sm xl:text-base">
          <div
            className={`${
              mobile ? "active:text-white" : "hover:text-white"
            } cursor-pointer text-white/80 transition-colors`}
            onClick={() => setModal("search")}
          >
            <span className="block md:hidden">
              <i className={`fa-solid fa-magnifying-glass text-lg`} />
            </span>
            <span className="hidden md:block">search</span>
          </div>
        </div>
        <div className="h-full flex items-center px-4 xl:px-5 md:text-xs lg:text-sm xl:text-base">
          <div
            className={`${
              mobile ? "active:text-white" : "hover:text-white"
            } cursor-pointer text-white/80 transition-colors`}
            onClick={() => setModal("new session")}
          >
            <span className="block md:hidden">
              <i className={`fa-solid fa-shuffle text-lg`} />
            </span>
            <span className="hidden md:block">new session</span>
          </div>
        </div>
        <div className="h-full flex items-center pl-4 xl:pl-5 md:text-base lg:text-base xl:text-base">
          <div className="w-5 flex justify-center items-center">
            <i
              onClick={toggleDarkMode}
              className={`${
                darkMode
                  ? `${
                      mobile
                        ? "active:text-purple-500"
                        : "hover:text-purple-500"
                    } fa-moon`
                  : `${
                      mobile
                        ? "active:text-yellow-600"
                        : "hover:text-yellow-600"
                    } fa-sun`
              } fa-solid /lg:text-sm xl:text-lg cursor-pointer text-white/80 transition-all`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
