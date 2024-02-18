import { createContext, Dispatch, SetStateAction } from "react";

// types
import type User from "@/types/userType";
import type Message from "@/types/messageType";
import io from "socket.io-client";

interface AppContextInterface {
  darkMode?: boolean;
  fullScreenImage: string;
  setFullScreenImage: Dispatch<SetStateAction<string>>;
  toggleDarkMode: () => void;
  mobile?: boolean;
  setMobile?: Dispatch<SetStateAction<boolean>>;
  user?: User;
  setUser: Dispatch<SetStateAction<User>>;
  globalMessages: Message[];
  setGlobalMessages: Dispatch<SetStateAction<Message[]>>;
  privateMessages: { [id: string]: { user: User; messages: Message[] } };
  setPrivateMessages: Dispatch<
    SetStateAction<{
      [id: string]: {
        user: User;
        messages: Message[];
      };
    }>
  >;
  socketConnection: ReturnType<typeof io> | null;
  initialLoad: boolean;
  modal:
    | "credits"
    | "messages"
    | "active users"
    | "search"
    | "new session"
    | undefined;
  setModal: Dispatch<
    SetStateAction<
      | "credits"
      | "messages"
      | "active users"
      | "search"
      | "new session"
      | undefined
    >
  >;
}

const AppContext = createContext<AppContextInterface>({
  darkMode: false,
  modal: undefined,
  setModal: () => {},
  fullScreenImage: "",
  setFullScreenImage: () => {},
  toggleDarkMode: () => {},
  mobile: false,
  setMobile: () => {},
  user: {},
  setUser: () => {},
  globalMessages: [],
  setGlobalMessages: () => {},
  privateMessages: {},
  setPrivateMessages: () => {},
  socketConnection: null,
  initialLoad: true,
});

export default AppContext;
