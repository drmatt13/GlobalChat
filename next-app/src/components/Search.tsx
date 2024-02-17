import { useContext } from "react";

// context
import AppContext from "@/context/AppContext";

const Search = () => {
  const { searching, setSearching } = useContext(AppContext);

  return (
    <div className="absolute w-screen h-screen bg-black/20 dark:bg-black/60 backdrop-blur-sm flex justify-center items-start z-20">
      <div
        className="absolute w-full h-full"
        onClick={() => setSearching(false)}
      />
      <div className="z-10 w-[95%] max-w-96 mt-12">
        <div className="bg-white/80 dark:bg-zinc-800/75 rounded-lg shadow-lg p-5">
          <input
            type="text"
            className="text-xs md:text-base w-full h-10 px-3 rounded-lg border border-gray-400/80 dark:border-zinc-600 outline-none"
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
