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
  setActiveUsers,
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
  setActiveUsers: Dispatch<
    SetStateAction<{
      [key: string]: {
        name: string;
        avatar: string;
        id: string;
      };
    }>
  >;
}) => {
  const [socketConnection, setSocketConnection] = useState<ReturnType<
    typeof io
  > | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    if (!user.name || !user.avatar || user.id || socketConnection) return;

    console.log(
      "SOCKET_URL: ",
      process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL
        ? process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL
        : "http://192.168.0.24:8080"
    );

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL
        ? process.env.NEXT_PUBLIC_SOCKETIO_SERVER_URL
        : "http://192.168.0.24:8080",
      {
        secure: true,
        rejectUnauthorized: false, // Only use this for self-signed certs!
      }
    );

    socket.on("connect", () => {
      setUser({ ...user, id: socket.id });
      socket.emit("register user", {
        name: user.name,
        avatar: user.avatar,
        id: socket.id,
      });
    });

    socket.on("update active users", (activeUsers) =>
      setActiveUsers(activeUsers)
    );

    socket.on(
      "user status change",
      ({ user, exiting }: { user: User; exiting: boolean }) => {
        if (!user.id) return;
        if (exiting) {
          setActiveUsers((prev) => {
            const newActiveUsers = { ...prev };
            delete newActiveUsers[user.id!];
            return newActiveUsers;
          });
        } else {
          setActiveUsers((prev) => ({ ...prev, [user.id as any]: user }));
        }
        setGlobalMessages((prev) => [
          ...prev,
          {
            user,
            type: "global",
            timestamp: Date.now(),
            exiting,
          },
        ]);
      }
    );

    socket.on("message", (message: Message) => {
      if (message.type === "global") {
        setGlobalMessages((prev) => [...prev, message]);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Connection Error:", error);
      setSocketError(error.message);
    });

    socket.on("error", (error) => {
      console.error("SocketConnection Error:", error);
      setSocketError(error.message);
    });

    socket.on("disconnect", () => {
      setGlobalMessages((prev) => [
        ...prev,
        {
          user,
          type: "global",
          timestamp: Date.now(),
          exiting: true,
        },
      ]);
      setUser({});
      setSocketConnection(null);
      socket.close();
    });

    setSocketConnection(socket);

    // return () => {
    //   socket.close();
    // };
  }, [setActiveUsers, setGlobalMessages, setUser, socketConnection, user]);

  useEffect(() => {
    if (!socketConnection || !user.id) return;
  }, [setActiveUsers, setGlobalMessages, setUser, socketConnection, user]);

  return { socketConnection, socketError };
};

export default useSocket;
