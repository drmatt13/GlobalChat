import { useContext } from "react";

// components
import RightMenu from "./RightMenu";

// context
import AppContext from "@/context/AppContext";

const Messages = () => {
  const { modal, setModal } = useContext(AppContext);

  return (
    <RightMenu
      active={modal === "messages"}
      closeMenu={() => setModal(undefined)}
    >
      messages
    </RightMenu>
  );
};

export default Messages;
