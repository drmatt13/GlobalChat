/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect } from "react";

// components
import ModalMenu from "./ModalMenu";

// context
import AppContext from "@/context/AppContext";

// data
import avatarList from "@/data/avatarList";

// styles
import styles from "@/styles/scrollbar.module.scss";

const ActiveUsers = () => {
  const { modal, setModal, activeUsers, darkMode } = useContext(AppContext);

  useEffect(() => {
    if (modal === "active users") {
      console.log(activeUsers);
    }
  }, [activeUsers, modal]);

  return (
    <ModalMenu
      active={modal === "active users"}
      closeMenu={() => setModal(undefined)}
      side="right"
    >
      <div className="text-xs text-center underline py-2 sm:py-3 my-2 w-full min-w-56 opacity-80">
        Active users
      </div>
      <div
        className={`${
          darkMode ? styles.darkScroll : styles.lightScroll
        } overflow-y-auto overflow-x-hidden pl-4 pr-5 sm:pl-5 sm:pr-6 pb-2 sm:pb-3 mb-2 mr-2.5`}
      >
        {Object.values(activeUsers)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((user) => (
            <div
              key={user.id}
              className="flex items-center mb-3.5 sm:mb-4 last-of-type:mb-0 group w-max cursor-pointer"
            >
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-full shadow-xl border border-black/20 dark:border-white/05"
                  src={`data:image/jpg;base64, ${avatarList[user.avatar]}`}
                  alt="user avatar"
                />
                <div
                  className="absolute top-[1.5rem] right-0 w-[.5rem] h-[.5rem] bg-green-500 rounded-full border border-green-900 dark:border-green-600"
                  title="active"
                />
              </div>
              <div className="ml-3 text-xs sm:text-sm group-hover:underline opacity-80 hover:opacity-100">
                {user.name}
              </div>
            </div>
          ))}
      </div>
    </ModalMenu>
  );
};

export default ActiveUsers;
