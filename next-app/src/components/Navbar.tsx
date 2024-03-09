/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState, useCallback, useRef } from "react";

// styles
import styles from "@/styles/animations.module.scss";

// lib
import playSound from "@/lib/playSound";

// context
import AppContext from "@/context/AppContext";

const Navbar = () => {
  const {
    socketConnection,
    modal,
    setModal,
    darkMode,
    toggleDarkMode,
    user,
    initialLoad,
    mobile,
    activeUsers,
    chatId,
    setChatId,
    privateMessages,
  } = useContext(AppContext);

  const pingRef = useRef<HTMLDivElement>(null);

  const [newMessages, setNewMessages] = useState<number>(0);

  useEffect(() => {
    // everytime the privateMessages object changes, check for unread messages and update the newMessages state
    setNewMessages((prev) => {
      const newNum = Object.values(privateMessages)
        .filter(
          (data) =>
            data.messages.length > 1 ||
            (data.messages.length === 1 && !data.messages[0].exiting)
        )
        .reduce(
          (acc, { IReadTheirLastMessage }) =>
            acc + (IReadTheirLastMessage ? 0 : 1),
          0
        );
      // if newNum is greater than prev, play a sound
      if (newNum > prev) {
        modal !== "messages" && playSound("/happy-pop-3-185288.mp3");
        if (pingRef.current) {
          pingRef.current.style.animation = "none";
          pingRef.current.offsetHeight;
          pingRef.current.style.animation = "";
        }
      }
      return newNum;
    });
  }, [modal, privateMessages]);

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
            } fa-solid lg:text-xl`}
          />
        </button>
      )}
    </div>
  ) : (
    <div className="h-14 lg:h-16 w-full flex justify-between bg-blue-600 dark:bg-black shrink-0 text-white px-3.5 sm:px-5 select-none">
      <div className="h-full flex items-center">
        <div
          className={`${
            mobile ? "active:opacity-100" : "hover:opacity-100"
          } flex group cursor-pointer opacity-80 transition-opacity`}
          onClick={() => (!chatId ? setModal("credits") : setChatId(undefined))}
        >
          {chatId ? (
            <div className="lg:text-xl w-[1.4rem] lg:w-[1.7rem] mr-[.25rem] sm:mr-[.6rem] lg:mr-[.65rem] text-center">
              <i className="fa-solid fa-chevron-left" />
            </div>
          ) : (
            <div className="hidden sm:block mr-[.6rem] lg:mr-[.65rem]">
              <img
                className="w-[1.4rem] lg:w-[1.7rem]"
                src="/socketio.png"
                alt="logo"
              />
            </div>
          )}
          <div
            className={`${
              chatId && "truncate max-w-44 sm:max-w-full"
            } lg:text-xl`}
          >
            {!chatId ? "GlobalChat" : privateMessages[chatId].user.name}
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="h-full flex items-center px-4 md:px-5">
          <div
            className={`${
              mobile ? "active:text-white" : "hover:text-white"
            } relative cursor-pointer text-white/80 transition-colors`}
            onClick={() => setModal("messages")}
          >
            <span className="block">
              <i className={`fa-regular fa-comment lg:text-xl`} />
              {newMessages ? (
                <div className="border-[1.5px] sm:border-2 border-blue-600 dark:border-black w-[1.125rem] h-[1.125rem] bg-red-600 dark:bg-red-500/75 dark:backdrop-blur absolute -top-1.5 sm:-top-2 right-2 rounded-full animate-cart-bounce flex justify-center items-center">
                  <div
                    ref={pingRef}
                    className={`${styles.animatePingOnce} absolute top-0 left-0 h-full w-full rounded-full -z-50 bg-red-600 dark:bg-red-500/75`}
                  ></div>
                  <div className="text-[.55rem] sm:text-[.65rem] font-extrabold md:font-bold text-white dark:text-black">
                    {newMessages}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </span>
            <span className="hidden /md:block z-10">conversations</span>
          </div>
        </div>
        <div className="h-full flex items-center px-4 md:px-5">
          <div
            className={`${
              mobile ? "active:text-white" : "hover:text-white"
            } cursor-pointer text-white/80 transition-colors`}
            onClick={() => setModal("active users")}
          >
            <span className="relative block">
              <div
                className={`${
                  Object.keys(activeUsers).length > 1 &&
                  "bg-green-500 animate-fade-in-fast"
                } w-[.3rem] h-[.3rem] absolute sm:-top-0.5 right-0 translate-x-full rounded-full`}
              />
              <i className={`fa-regular fa-user lg:text-xl`} />
            </span>
            <span className="hidden /md:block">connected users</span>
          </div>
        </div>

        <div className="h-full flex items-center px-4 md:px-5">
          <div
            className={`${
              mobile ? "active:text-white" : "hover:text-white"
            } cursor-pointer text-white/80 transition-colors`}
            onClick={() => setModal("search")}
          >
            <span className="block">
              <i className={`fa-solid fa-magnifying-glass lg:text-xl`} />
            </span>
            <span className="hidden /md:block">search</span>
          </div>
        </div>
        <div className="h-full flex items-center px-4 md:px-5">
          <div
            className={`${
              mobile ? "active:text-white" : "hover:text-white"
            } cursor-pointer text-white/80 transition-colors`}
            onClick={() => setModal("new session")}
          >
            <span className="block">
              <i className={`fa-solid fa-shuffle lg:text-xl`} />
            </span>
            <span className="hidden /md:block">new session</span>
          </div>
        </div>
        <div className="h-full flex items-center pl-3.5 sm:pl-4 md:pl-5">
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
              } fa-solid lg:text-xl cursor-pointer text-white/80 transition-all`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
