import { useContext, useEffect, useRef } from "react";

// components
import RightMenu from "./RightMenu";

// context
import AppContext from "@/context/AppContext";

const Search = () => {
  const { modal, setModal } = useContext(AppContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeOutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeOutRef.current);
    if (modal === "search") {
      timeOutRef.current = setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [modal]);

  return (
    <RightMenu
      active={modal === "search"}
      closeMenu={() => setModal(undefined)}
    >
      <div className="p-5">
        <input
          ref={inputRef}
          type="text"
          className="text-xs md:text-base w-full h-10 px-3 rounded-lg border border-gray-400/80 dark:border-black/50 outline-none"
          placeholder="Search..."
        />
      </div>
      <div className="overflow-y-auto flex-1 px-5 pb-5 flex">
        <div className="flex-1 /bg-white/10"></div>
      </div>
    </RightMenu>
  );
};

export default Search;
