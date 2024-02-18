import { useContext, useEffect, useRef } from "react";

// context
import AppContext from "@/context/AppContext";

const Search = () => {
  const { searching, setSearching } = useContext(AppContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searching) {
      inputRef.current?.focus();
    }
  }, [searching]);

  return (
    <div
      className={`${
        searching ? "pointer-events-auto" : "pointer-events-none"
      } absolute w-screen h-lvh  flex justify-center items-start z-20`}
    >
      <div
        className={`${
          searching ? "opacity-100" : "opacity-0"
        }  absolute w-full h-full bg-black/20 dark:bg-black/60 backdrop-blur`}
        onClick={() => setSearching(false)}
      />
      <div
        className={`${
          searching
            ? "opacity-100 ease-out duration-300"
            : "opacity-0 -translate-y-36 ease-in duration-300"
        } z-10 w-[90%] max-w-96 mt-12 transition-all bg-white/85 dark:bg-zinc-800/85 rounded-lg shadow-lg border border-white/50 dark:border-black/50`}
      >
        <div className="p-5">
          <input
            ref={inputRef}
            type="text"
            className="text-xs md:text-base w-full h-10 px-3 rounded-lg border border-gray-400/80 dark:border-black/50 outline-none"
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
