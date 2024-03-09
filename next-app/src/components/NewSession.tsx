import { useContext, useCallback } from "react";

// components
import ModalMenu from "@/components/ModalMenu";

// context
import AppContext from "@/context/AppContext";

const NewSession = () => {
  const {
    modal,
    setModal,
    setUser,
    setPrivateMessages,
    socketConnection,
    mobile,
  } = useContext(AppContext);

  const newSession = useCallback(() => {
    setUser({});
    setModal(undefined);
    socketConnection?.disconnect();
  }, [setModal, setUser, socketConnection]);

  return (
    <ModalMenu
      active={modal === "new session"}
      closeMenu={() => setModal(undefined)}
      side="right"
    >
      <div className="flex flex-col p-4 sm:p-5 select-none">
        <button
          onClick={() => setModal(undefined)}
          className={`${
            mobile
              ? "active:bg-blue-600 dark:active:text-white active:duration-100 active:ease-out"
              : "hover:bg-blue-600 dark:hover:text-white hover:duration-100 hover:ease-out"
          } duration-150 ease-in w-full py-2 px-7 mb-3 rounded-md text-xs sm:text-sm bg-blue-500 text-white dark:bg-blue-600/80 dark:text-white/90 transition-colors`}
        >
          Return to chat
        </button>
        <button
          onClick={newSession}
          className={`${
            mobile
              ? "active:bg-red-600 dark:active:text-white active:duration-100 active:ease-out"
              : "hover:bg-red-600 dark:hover:text-white hover:duration-100 hover:ease-out"
          } duration-150 ease-in w-full py-2 px-7 rounded-md text-xs sm:text-sm bg-red-500 text-white dark:bg-red-600/80 dark:text-white/90 transition-colors`}
        >
          Delete session
        </button>
      </div>
    </ModalMenu>
  );
};

export default NewSession;
