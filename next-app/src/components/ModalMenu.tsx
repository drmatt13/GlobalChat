import { ReactNode, useContext } from "react";

// context
import AppContext from "@/context/AppContext";

// styles
import styles from "@/styles/scrollbar.module.scss";

const ModalMenu = ({
  active,
  closeMenu,
  side,
  children,
}: {
  active: boolean;
  closeMenu: () => void;
  side: "left" | "right";
  children?: ReactNode;
}) => {
  const { darkMode } = useContext(AppContext);

  return (
    <div
      className={`${
        active ? "pointer-events-auto" : "pointer-events-none"
      } absolute w-full h-lvh z-20 flex justify-end overflow-hidden`}
    >
      <div
        className={`${
          active
            ? "opacity-100 duration-500 ease-out"
            : "opacity-0 duration-300 ease-in"
        }  absolute w-full h-[200vh] bg-black/20 dark:bg-black/60 backdrop-blur transition-opacity`}
        onClick={closeMenu}
      />
      <div
        className={`${
          side === "left" ? "left-0" : "right-0"
        } h-max max-h-full absolute top-0 flex pointer-events-none`}
      >
        <div
          className={`
          ${active && "opacity-100 translate-x-0 duration-500 ease-out"}
          ${
            !active &&
            `${
              side === "left" ? "-translate-x-full" : "translate-x-full"
            } opacity-0 duration-300 ease-in`
          }
          z-10 transition-all pointer-events-auto bg-white/85 dark:bg-zinc-800/85 border-l border-white/50 dark:border-black/50 m-4 sm:m-5 rounded-lg`}
        >
          <div
            className={`${
              darkMode ? styles.darkScroll : styles.lightScroll
            } h-full flex flex-col overflow-hidden`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMenu;
