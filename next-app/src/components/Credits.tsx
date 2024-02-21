import { useContext } from "react";

// components
import ModalMenu from "@/components/ModalMenu";

// context
import AppContext from "@/context/AppContext";

const Credits = () => {
  const { modal, setModal, mobile } = useContext(AppContext);

  return (
    <ModalMenu
      active={modal === "credits"}
      closeMenu={() => setModal(undefined)}
      side="left"
    >
      <div className="p-4 sm:p-5">
        <div className="pr-4">
          <p className="text-sm sm:text-md">Created by Matthew Sweeney</p>
          <p className="mt-6 text-xs sm:text-sm underline opacity-75">
            created and deployed with:
          </p>
          <p className="mt-1 text-xs text-sky-500 dark:text-yellow-500/80">
            Next.js 14, TypeScript, Tailwind, Socket.IO, Docker, AWS
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
    </ModalMenu>
  );
};

export default Credits;
