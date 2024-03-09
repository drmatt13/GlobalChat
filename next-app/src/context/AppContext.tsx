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
  unreadGlobalMessage: boolean;
  setUnreadGlobalMessage: Dispatch<SetStateAction<boolean>>;
  privateMessages: {
    [id: string]: {
      user: User;
      messages: Message[];
      IReadTheirLastMessage: number;
      TheyReadMyLastMessage: number;
    };
  };
  setPrivateMessages: Dispatch<
    SetStateAction<{
      [id: string]: {
        user: User;
        messages: Message[];
        IReadTheirLastMessage: number;
        TheyReadMyLastMessage: number;
      };
    }>
  >;
  updatePrivateMessages: (user: User) => void;
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
  activeUsers: {
    [key: string]: {
      name: string;
      avatar: string;
      id: string;
    };
  };
  setActiveUsers: Dispatch<
    SetStateAction<{
      [key: string]: {
        name: string;
        avatar: string;
        id: string;
      };
    }>
  >;
  chatId: string | undefined;
  setChatId: Dispatch<SetStateAction<string | undefined>>;
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
  unreadGlobalMessage: false,
  setUnreadGlobalMessage: () => {},
  privateMessages: {},
  setPrivateMessages: () => {},
  updatePrivateMessages: () => {},
  socketConnection: null,
  initialLoad: true,
  activeUsers: {},
  setActiveUsers: () => {},
  chatId: undefined,
  setChatId: () => {},
});

export default AppContext;
