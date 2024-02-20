import { useContext, useEffect } from "react";

// components
import RightMenu from "./RightMenu";

// context
import AppContext from "@/context/AppContext";

const ActiveUsers = () => {
  const { modal, setModal, activeUsers } = useContext(AppContext);

  useEffect(() => {
    if (modal === "active users") {
      console.log(activeUsers);
    }
  }, [activeUsers, modal]);

  return (
    <RightMenu
      active={modal === "active users"}
      closeMenu={() => setModal(undefined)}
    >
      active users
    </RightMenu>
  );
};

export default ActiveUsers;
