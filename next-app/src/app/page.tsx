"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";

// components
import Credits from "@/components/Credits";
import ChooseUsername from "@/components/ChooseUsername";
import ChooseAvatar from "@/components/ChooseAvatar";
import Navbar from "@/components/Navbar";
import GlobalChat from "@/components/GlobalChat";
import Search from "@/components/Search";
import FullScreenImage from "@/components/FullScreenImage";

// context
import AppContext from "@/context/AppContext";

// hooks
import useSocket from "@/hooks/useSocket";

// types
import type User from "@/types/userType";
import type Message from "@/types/messageType";

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobile, setMobile] = useState<boolean>(false);

  const [credits, setCredits] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [user, setUser] = useState<User>({});

  const [fullScreenImage, setFullScreenImage] = useState<string>("");

  const [globalMessages, setGlobalMessages] = useState<Message[]>([]);
  const [privateMessages, setPrivateMessages] = useState<{
    [id: string]: { user: User; messages: Message[] };
  }>({});

  const { socketConnection, socketError } = useSocket({
    user,
    setUser,
    setGlobalMessages,
    setPrivateMessages,
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
    if (Cookies.get("darkMode") === "true") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const onMouseMove = () => {
      if (mobile) setMobile(false);
    };
    const onTouchStart = () => {
      if (!mobile) setMobile(true);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [mobile]);

  return (
    <>
      <style jsx global={true}>{`
        html {
          font-size: clamp(14px, 2.6vw, 16px);
          line-height: 1.5;
        }
      `}</style>
      <AppContext.Provider
        value={{
          user,
          setUser,
          credits,
          setCredits,
          fullScreenImage,
          setFullScreenImage,
          globalMessages,
          setGlobalMessages,
          privateMessages,
          setPrivateMessages,
          darkMode,
          toggleDarkMode,
          mobile,
          socketConnection,
          searching,
          setSearching,
        }}
      >
        <div className="h-lvh bg-gray-200 dark:bg-zinc-800 dark:text-white">
          <div className="relative w-screen h-dvh flex flex-col">
            <Credits />
            <Search />
            {fullScreenImage && <FullScreenImage />}
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
              <GlobalChat />
            )}
          </div>
        </div>
      </AppContext.Provider>
    </>
  );
}
