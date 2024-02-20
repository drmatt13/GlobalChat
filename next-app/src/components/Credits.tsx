import { useContext } from "react";

// context
import AppContext from "@/context/AppContext";

const Credits = () => {
  const { modal, setModal, mobile } = useContext(AppContext);

  return (
    <div
      className={`${
        modal === "credits" ? "pointer-events-auto" : "pointer-events-none"
      } absolute w-full h-lvh flex justify-start items-start z-20 overflow-hidden`}
    >
      <div
        className={`${
          modal === "credits"
            ? "opacity-100 duration-500 ease-out"
            : "opacity-0 duration-300 ease-in"
        }  absolute w-full h-[200vh] bg-black/20 dark:bg-black/60 backdrop-blur transition-opacity`}
        onClick={() => setModal(undefined)}
      />
      <div
        className={`${
          modal === "credits"
            ? "opacity-100 ease-out duration-500"
            : "opacity-0 -translate-x-full ease-in duration-300"
        } z-10 w-max ml-5 mt-5 transition-all bg-white/85 dark:bg-zinc-800/85 rounded-lg shadow-lg pl-5 pr-9 py-5 border border-white/50 dark:border-black/40 backdrop-blur`}
      >
        <p className="text-sm sm:text-md">Created by Matthew Sweeney</p>
        <p className="mt-6 text-xs sm:text-sm underline opacity-75">
          created and deployed with:
        </p>
        <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-500/80">
          Next.js 14, Tailwind, Socket.IO, Docker, AWS
        </p>
        <div className="mt-6 text-xs sm:text-sm">
          <a
            href="https://matts-projects.vercel.app"
            className={`${
              mobile ? "active:underline" : "hover:underline"
            } text-blue-500 dark:text-blue-400 visited:text-purple-500 dark:visited:text-purple-400`}
            target="_blank"
            rel="noopener noreferrer"
          >
            check out more of my work
          </a>
        </div>
      </div>
    </div>
  );
};

export default Credits;
