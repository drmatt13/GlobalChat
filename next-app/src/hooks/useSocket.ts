import { useState, useEffect, Dispatch, SetStateAction } from "react";
import io from "socket.io-client";

// types
import type User from "@/types/userType";
import type Message from "@/types/messageType";

const useSocket = ({
  user,
  setUser,
  setGlobalMessages,
  setPrivateMessages,
}: {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  setGlobalMessages: Dispatch<SetStateAction<Message[]>>;
  setPrivateMessages: Dispatch<
    SetStateAction<{
      [id: string]: {
        user: User;
        messages: Message[];
      };
    }>
  >;
}) => {
  const [socketConnection, setSocketConnection] = useState<ReturnType<
    typeof io
  > | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    if (!user.name || !user.avatar) return;

    console.log(
      "SOCKET_URL: ",
      process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL
        ? process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL
        : "http://localhost:8080"
    );

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL
        ? process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL
        : "http://localhost:8080",
      {
        secure: true,
        rejectUnauthorized: false, // Only use this for self-signed certs!
      }
    );

    socket.on("connect", () => {
      socket.emit("register user", {
        name: user.name,
        avatar: user.avatar,
      });
    });

    socket.on(
      "broadcast user status change",
      ({ user, exiting }: { user: User; exiting: boolean }) => {
        setGlobalMessages((prev) => [
          ...prev,
          {
            user,
            timestamp: Date.now(),
            exiting,
          },
        ]);
      }
    );

    socket.on("broadcast global message", (message) => {
      setGlobalMessages((prev) => [...prev, message]);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection Error:", error);
      setSocketError(error.message);
    });

    socket.on("error", (error) => {
      console.error("Socket Error:", error);
      setSocketError(error.message);
    });

    socket.on("disconnect", () => {
      setGlobalMessages((prev) => [
        ...prev,
        {
          user,
          timestamp: Date.now(),
          exiting: true,
        },
      ]);
    });

    setSocketConnection(socket);

    return () => {
      socket.close();
    };
  }, [setGlobalMessages, setUser, user]);

  return { socketConnection, socketError };
};

export default useSocket;
