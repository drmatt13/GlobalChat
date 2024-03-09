"use client";
import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

// components
import Credits from "@/components/Credits";
import Messages from "@/components/Messages";
import ActiveUsers from "@/components/ActiveUsers";
import Search from "@/components/Search";
import NewSession from "@/components/NewSession";
import ChooseUsername from "@/components/ChooseUsername";
import ChooseAvatar from "@/components/ChooseAvatar";
import Navbar from "@/components/Navbar";
import Chat from "@/components/Chat";
import FullScreenImage from "@/components/FullScreenImage";

// context
import AppContext from "@/context/AppContext";

// hooks
import useSocket from "@/hooks/useSocket";

// types
import type User from "@/types/userType";
import type Message from "@/types/messageType";

export default function Home() {
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobile, setMobile] = useState<boolean>(false);
  const [activeUsers, setActiveUsers] = useState<{
    [key: string]: {
      name: string;
      avatar: string;
      id: string;
    };
  }>({});

  const [modal, setModal] = useState<
    | "credits"
    | "messages"
    | "active users"
    | "search"
    | "new session"
    | undefined
  >(undefined);

  const [user, setUser] = useState<User>({});

  const [chatId, setChatId] = useState<string | undefined>(undefined);

  const [fullScreenImage, setFullScreenImage] = useState<string>("");

  const [globalMessages, setGlobalMessages] = useState<Message[]>([]);
  const [unreadGlobalMessage, setUnreadGlobalMessage] = useState(false);
  const [privateMessages, setPrivateMessages] = useState<{
    [id: string]: {
      user: User;
      messages: Message[];
      IReadTheirLastMessage: number;
      TheyReadMyLastMessage: number;
    };
  }>({});

  const updatePrivateMessages = useCallback(
    (user: User) => {
      if (user.id && !privateMessages[user.id]) {
        setPrivateMessages((prev) => ({
          ...prev,
          [user.id!]: {
            user,
            messages: [],
            IReadTheirLastMessage: 0,
            TheyReadMyLastMessage: 0,
          },
        }));
      }
    },
    [privateMessages]
  );

  const { socketConnection, socketError } = useSocket({
    user,
    setUser,
    setGlobalMessages,
    setPrivateMessages,
    setActiveUsers,
    chatId,
    setChatId,
  });

  const toggleDarkMode = useCallback(() => {
    if (document.body.classList.contains("dark")) {
      setDarkMode(false);
      document.body.classList.remove("dark");
      Cookies.set("darkMode", "false");
    } else {
      setDarkMode(true);
      document.body.classList.add("dark");
      Cookies.set("darkMode", "true");
    }
  }, [setDarkMode]);

  useEffect(() => {
    if (user.id) updatePrivateMessages(user);
  }, [updatePrivateMessages, user]);

  useEffect(() => {
    // if i didnt read their last message, then i want to emit that i read their last message
    if (chatId && privateMessages[chatId].messages.length > 0) {
      if (!privateMessages[chatId].IReadTheirLastMessage) {
        setPrivateMessages((prev) => ({
          ...prev,
          [chatId]: {
            ...prev[chatId],
            IReadTheirLastMessage: Date.now(),
          },
        }));
        // emit
        socketConnection?.emit("read", chatId);
      }
    }
  }, [chatId, privateMessages, socketConnection]);

  useEffect(() => {
    if (Cookies.get("darkMode") === "true") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    let recentTouch = false;
    const onMouseMove = () => {
      if (!recentTouch) {
        setMobile(false);
      }
      recentTouch = false;
    };
    const onTouchStart = () => {
      recentTouch = true;
      setMobile(true);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  useEffect(() => {
    console.log(privateMessages);
  }, [privateMessages]);

  return (
    <>
      <AppContext.Provider
        value={{
          user,
          setUser,
          modal,
          setModal,
          fullScreenImage,
          setFullScreenImage,
          globalMessages,
          setGlobalMessages,
          unreadGlobalMessage,
          setUnreadGlobalMessage,
          privateMessages,
          setPrivateMessages,
          updatePrivateMessages,
          darkMode,
          toggleDarkMode,
          mobile,
          socketConnection,
          initialLoad,
          activeUsers,
          setActiveUsers,
          chatId,
          setChatId,
        }}
      >
        <div className="h-full relative bg-gray-200 dark:bg-zinc-800 dark:text-white">
          <div className="sticky top-0">
            {user.id && (
              <>
                <Credits />
                <Messages />
                <ActiveUsers />
                <Search />
                <NewSession />
                <FullScreenImage />
              </>
            )}
            <div className="relative w-full h-dvh flex flex-col justify-start overflow-hidden">
              <Navbar />
              {!user.name ? (
                <ChooseUsername />
              ) : !user.avatar ? (
                <ChooseAvatar />
              ) : socketError ? (
                <div>error</div>
              ) : !socketConnection ? (
                <div>connecting...</div>
              ) : (
                <div className="h-full flex flex-col justify-start overflow-hidden">
                  <Chat />
                </div>
              )}
            </div>
          </div>
        </div>
      </AppContext.Provider>
    </>
  );
}
