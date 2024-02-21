import { useContext } from "react";

// components
import ModalMenu from "./ModalMenu";

// context
import AppContext from "@/context/AppContext";

const Messages = () => {
  const { modal, setModal } = useContext(AppContext);

  return (
    <ModalMenu
      active={modal === "messages"}
      closeMenu={() => setModal(undefined)}
      side="right"
    >
      messages
    </ModalMenu>
  );
};

export default Messages;
