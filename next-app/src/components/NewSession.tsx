import { useContext, useCallback } from "react";

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
    <div
      className={`${
        modal === "new session" ? "pointer-events-auto" : "pointer-events-none"
      } absolute w-full h-lvh flex justify-center md:justify-end items-start z-20 overflow-hidden`}
    >
      <div
        className={`${
          modal === "new session"
            ? "opacity-100 duration-500 ease-out"
            : "opacity-0 duration-300 ease-in"
        }  absolute w-full h-[200vh] bg-black/20 dark:bg-black/60 backdrop-blur transition-opacity`}
        onClick={() => setModal(undefined)}
      />
      <div
        className={`${
          modal === "new session"
            ? "opacity-100 ease-out duration-500"
            : "opacity-0 -translate-y-96 md:translate-y-0 md:translate-x-full ease-in duration-300"
        } z-10 w-[90%] max-w-96 mr-0 md:mr-8 mt-[5%] md:mt-8 transition-all bg-white/85 dark:bg-zinc-800/85 rounded-lg shadow-lg p-5 text-sm border border-white/50 dark:border-black/40 backdrop-blur`}
      >
        <button
          className="py-2 px-3 bg-white rounded-lg border border-black/50 dark:text-black"
          onClick={newSession}
        >
          click me
        </button>
      </div>
    </div>
  );
};

export default NewSession;
