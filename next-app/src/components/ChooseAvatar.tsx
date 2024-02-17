/* eslint-disable @next/next/no-img-element */
import { useState, useContext } from "react";

// context
import AppContext from "@/context/AppContext";

// data
import avatarList from "@/data/avatarList";
import avatarOrder from "@/data/avatarOrder";

// styles
import styles from "@/styles/scrollbar.module.scss";

const ChooseAvatar = () => {
  const { setUser, darkMode } = useContext(AppContext);

  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div
      className={`${
        darkMode ? styles.darkScroll : styles.lightScroll
      } w-full h-full flex justify-center items-center`}
    >
      <div className="p-4 sm-p-0 w-full sm:w-auto h-full flex flex-col justify-center">
        <div className="flex-1 max-h-max sm:max-h-80 grid grid-cols-6 gap-2 overflow-y-auto pr-2">
          {avatarOrder.map((_, i) => (
            <img
              key={i}
              src={`data:image/jpg;base64, ${avatarList[avatarOrder[i]]}`}
              alt="avatar"
              className={`${
                selected === i
                  ? "ring-4 sm:ring-[6px] ring-blue-500 dark:ring-blue-600 scale-[.8]"
                  : "border border-black/10 dark:border-white/20"
              } w-full sm:w-20 aspect-square rounded-md cursor-pointer transition-all ease-in duration-100 object-cover will-change-transform`}
              onClick={() => setSelected(i)}
            />
          ))}
        </div>
        <div>
          <button
            disabled={selected === null}
            className={`${
              selected !== null
                ? "bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 dark:hover:bg-blue-500 text-white"
                : "bg-black/30 dark:bg-neutral-600 dark:opacity-60 dark:text-black cursor-not-allowed"
            } mt-4 sm:mt-2 rounded-md w-full h-12 transition-colors`}
            onClick={() => {
              if (selected !== null) {
                setUser((prev) => ({ ...prev, avatar: avatarOrder[selected] }));
              }
            }}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseAvatar;
