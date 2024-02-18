import { useContext } from "react";

// context
import AppContext from "@/context/AppContext";

const Credits = () => {
  const { credits, setCredits } = useContext(AppContext);

  return (
    <div
      className={`${
        credits ? "pointer-events-auto" : "pointer-events-none"
      } absolute w-screen h-lvh  flex justify-center items-start z-20`}
    >
      <div
        className={`${
          credits ? "opacity-100" : "opacity-0"
        }  absolute w-full h-full bg-black/20 dark:bg-black/60 backdrop-blur`}
        onClick={() => setCredits(false)}
      />
      <div
        className={`${
          credits
            ? "opacity-100 ease-out duration-500"
            : "opacity-0 translate-y-80 ease-in duration-300"
        } z-10 w-[90%] max-w-96 mt-40 transition-all bg-white/85 dark:bg-zinc-800/85 rounded-lg shadow-lg p-5 text-sm text-center border border-white/50 dark:border-black/50`}
      >
        <p>Created by Matthew Sweeney</p>
        <div className="mt-1.5 text-xs">
          <a
            href="https://matts-projects.vercel.app"
            className="text-blue-500 dark:text-blue-400 hover:underline visited:text-purple-500 dark:visited:text-purple-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            check out more of my work
          </a>
        </div>
        <p className="mt-16 text-xs">Created with:</p>
        <p className="mt-1.5 text-xs opacity-75">
          Next.js 14, Tailwind, Socket.IO, Docker, AWS
        </p>
      </div>
    </div>
  );
};

export default Credits;
