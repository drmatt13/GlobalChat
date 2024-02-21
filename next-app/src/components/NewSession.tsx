import { useContext, useCallback } from "react";

// components
import ModalMenu from "@/components/ModalMenu";

// context
import AppContext from "@/context/AppContext";

const NewSession = () => {
  const { modal, setModal, setUser, setPrivateMessages, socketConnection } =
    useContext(AppContext);

  const newSession = useCallback(() => {
    setUser({});
    setPrivateMessages({});
    socketConnection?.disconnect();
    setModal(undefined);
  }, [setModal, setPrivateMessages, setUser, socketConnection]);

  return (
    <ModalMenu
      active={modal === "new session"}
      closeMenu={() => setModal(undefined)}
      side="right"
    >
      <div className="flex flex-col p-4 sm:p-5">
        <button
          onClick={() => setModal(undefined)}
          className="
          w-full
          py-2
          px-7
          mb-3
          rounded-md
          text-xs
          md:text-sm
          bg-blue-500
          text-white
          dark:bg-blue-600/80
          dark:text-white/90
          hover:bg-blue-600
          dark:hover:bg-blue-600
          dark:hover:text-white
          transition-colors
        "
        >
          Return to chat
        </button>
        <button
          onClick={newSession}
          className="
          w-full
          py-2
          px-7
          rounded-md
          text-xs
          md:text-sm
          bg-red-500
          text-white
          dark:bg-red-600/80
          dark:text-white/90
          hover:bg-red-600
          dark:hover:bg-red-600
          dark:hover:text-white
          transition-colors
        "
        >
          Delete session
        </button>
      </div>
    </ModalMenu>
  );
};

export default NewSession;
