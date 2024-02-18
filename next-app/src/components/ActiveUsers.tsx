import { useContext } from "react";

// components
import RightMenu from "./RightMenu";

// context
import AppContext from "@/context/AppContext";

const ActiveUsers = () => {
  const { modal, setModal } = useContext(AppContext);

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
