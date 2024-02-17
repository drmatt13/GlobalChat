/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState, useCallback } from "react";

// context
import AppContext from "@/context/AppContext";

const Navbar = () => {
  const {
    socketConnection,
    darkMode,
    toggleDarkMode,
    setSearching,
    user,
    setUser,
    setPrivateMessages,
  } = useContext(AppContext);

  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const newSession = useCallback(() => {
    setUser({});
    setPrivateMessages({});
    socketConnection?.disconnect();
  }, [setPrivateMessages, setUser, socketConnection]);

  useEffect(() => {
    setInitialLoad(false);
  }, []);

  return !socketConnection?.connected ? (
    <div
      className={`${
        user?.name &&
        "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto transition-opacity"
      } absolute top-8 right-8 h-10 w-10 flex justify-center items-center`}
    >
      {!initialLoad && (
        <button
          className={`w-full h-full cursor-pointer hover:scale-90 transition-all bg-black/50 hover:bg-black/75 z-50 rounded-full animate-fade-in-fast`}
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
    <div className="h-14 w-full flex justify-between bg-blue-600 dark:bg-black shrink-0 text-white">
      <div className="h-full flex items-center px-4 xl:px-5">
        <div className="hidden sm:block mr-[.6rem]">
          <img className="w-[1.4rem]" src="/socketio.png" alt="logo" />
        </div>
        <div>SocketChat</div>
      </div>
      <div className="flex">
        <div className="h-full flex items-center px-4 xl:px-5 md:text-xs lg:text-sm xl:text-base">
          <div className="cursor-pointer text-white/80 hover:text-white transition-colors">
            <span className="block md:hidden">
              <i className={`fa-regular fa-comment text-lg`} />
            </span>
            <span className="hidden md:block">conversations</span>
          </div>
        </div>
        <div className="h-full flex items-center px-4 xl:px-5 md:text-xs lg:text-sm xl:text-base">
          <div className="cursor-pointer text-white/80 hover:text-white transition-colors">
            <span className="block md:hidden">
              <i className={`fa-regular fa-user text-lg`} />
            </span>
            <span className="hidden md:block">connected users</span>
          </div>
        </div>
        <div className="h-full flex items-center px-4 xl:px-5 md:text-xs lg:text-sm xl:text-base">
          <div
            className="cursor-pointer text-white/80 hover:text-white transition-colors"
            onClick={() => setSearching(true)}
          >
            <span className="block md:hidden">
              <i className={`fa-solid fa-magnifying-glass text-lg`} />
            </span>
            <span className="hidden md:block">search</span>
          </div>
        </div>
        <div className="h-full flex items-center px-4 xl:px-5 md:text-xs lg:text-sm xl:text-base">
          <div
            className="cursor-pointer text-white/80 hover:text-white transition-colors"
            onClick={newSession}
          >
            <span className="block md:hidden">
              <i className={`fa-solid fa-shuffle text-lg`} />
            </span>
            <span className="hidden md:block">new session</span>
          </div>
        </div>
        <div className="h-full flex items-center px-4 xl:px-5 md:text-xs lg:text-sm xl:text-base">
          <div className="w-5 flex justify-center items-center">
            <i
              onClick={toggleDarkMode}
              className={`${
                darkMode
                  ? "fa-moon hover:text-purple-500"
                  : "fa-sun hover:text-yellow-600"
              } fa-solid lg:text-sm xl:text-lg cursor-pointer text-white/80 transition-all`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
