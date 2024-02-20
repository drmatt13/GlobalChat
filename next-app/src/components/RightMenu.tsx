import { ReactNode } from "react";

const RightMenu = ({
  active,
  closeMenu,
  children,
}: {
  active: boolean;
  closeMenu: () => void;
  children?: ReactNode;
}) => {
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
      <div className="h-full absolute top-0 right-0 flex pointer-events-none">
        <div
          className={`
          ${active && "opacity-100 translate-x-0 duration-500 ease-out"}
          ${!active && "opacity-0 translate-x-full duration-300 ease-in"}
          z-10 transition-all pointer-events-auto bg-white/85 dark:bg-zinc-800/85 border-l border-white/50 dark:border-black/50`}
        >
          <div className="h-full flex flex-col min-w-56 w-[75vw] max-w-96">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightMenu;
