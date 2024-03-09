/* eslint-disable @next/next/no-img-element */
import { useContext, useState, useEffect, Fragment } from "react";

// components
import ModalMenu from "./ModalMenu";

// context
import AppContext from "@/context/AppContext";

// data
import avatarList from "@/data/avatarList";

// styles
import styles from "@/styles/scrollbar.module.scss";

const ActiveUsers = () => {
  const {
    modal,
    setModal,
    activeUsers,
    darkMode,
    user,
    mobile,
    setChatId,
    updatePrivateMessages,
  } = useContext(AppContext);

  const [activeUsersList, setActiveUsersList] = useState<Array<typeof user>>(
    Object.values(activeUsers).sort((a, b) => a.name.localeCompare(b.name))
  );

  useEffect(() => {
    setActiveUsersList((prev) =>
      Object.values(activeUsers).sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [activeUsers]);

  return (
    <ModalMenu
      active={modal === "active users"}
      closeMenu={() => setModal(undefined)}
      side="right"
    >
      {activeUsersList.length === 1 ? (
        <div className="text-xs sm:text-sm text-center pb-1 sm:pb-2 pt-2 sm:pt-3 my-2 w-56 sm:w-64 opacity-80 dark:opacity-70">
          No other active users 😔
        </div>
      ) : (
        <>
          <div className="text-xs sm:text-sm text-center underline pb-1 sm:pb-2 pt-2 sm:pt-3 my-2 w-56 sm:w-64 opacity-80 dark:opacity-70">
            Active users
          </div>
          <div
            className={`overflow-y-auto overflow-x-hidden pl-4 pr-5 sm:pl-5 sm:pr-6 pb-2 sm:pb-3 mb-2 mr-2.5`}
          >
            {activeUsersList.map((activeUser) => (
              <Fragment key={activeUser?.id}>
                {activeUser?.id !== user?.id && (
                  <div
                    onClick={() => {
                      activeUser && updatePrivateMessages(activeUser);
                      activeUser && setChatId(activeUser.id);
                      setModal(undefined);
                    }}
                    className="flex items-center mb-3.5 sm:mb-4 last-of-type:mb-0 group w-max cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        className="h-8 w-8 rounded-full shadow-xl border border-black/20 dark:border-white/05"
                        src={`data:image/jpg;base64, ${
                          avatarList[activeUser?.avatar ? activeUser.avatar : 0]
                        }`}
                        alt="activeUser avatar"
                      />
                      <div className="absolute top-[1.5rem] right-0 w-[.5rem] h-[.5rem] bg-green-500 border-green-900 dark:border-green-600 rounded-full border" />
                    </div>
                    <div
                      className={`${
                        mobile
                          ? "group-active:underline group-active:opacity-100"
                          : "group-hover:underline group-hover:opacity-100"
                      } ml-3 text-xs sm:text-sm opacity-80`}
                    >
                      {activeUser?.name}
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </>
      )}
    </ModalMenu>
  );
};

export default ActiveUsers;
