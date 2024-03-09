import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";
import io from "socket.io-client";

// types
import type User from "@/types/userType";
import type Message from "@/types/messageType";

// lib
import playSound from "@/lib/playSound";

const useSocket = ({
  user,
  setUser,
  setGlobalMessages,
  setPrivateMessages,
  setActiveUsers,
  chatId,
  setChatId,
}: {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  setGlobalMessages: Dispatch<SetStateAction<Message[]>>;
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
}) => {
  const [socketConnection, setSocketConnection] = useState<ReturnType<
    typeof io
  > | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);

  const chatIdRef = useRef(chatId);

  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

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

    setSocketConnection(socket);
  }, [socketConnection, user.avatar, user.id, user.name]);

  useEffect(() => {
    if (!socketConnection) return;

    socketConnection.on("connect", () => {
      setUser({ ...user, id: socketConnection.id });
      socketConnection.emit("register user", {
        name: user.name,
        avatar: user.avatar,
        id: socketConnection.id,
      });
      // setPrivateMessages((prev) => {
      //   const newPrivateMessages = { ...prev };
      //   newPrivateMessages[socket] = {
      //     user,
      //     messages: [],
      //     lastReadIndex: 0,
      //   };
      //   return newPrivateMessages;
      // });
    });

    socketConnection.on("update active users", (activeUsers) =>
      setActiveUsers(activeUsers)
    );

    socketConnection.on(
      "user status change",
      ({ user, exiting }: { user: User; exiting: boolean }) => {
        if (!user.id) return;
        if (exiting) {
          setActiveUsers((prev) => {
            const newActiveUsers = { ...prev };
            delete newActiveUsers[user.id!];
            return newActiveUsers;
          });
          if (chatIdRef.current === user.id)
            playSound("/discord-notification.mp3");
          setPrivateMessages((prev) => {
            const newPrivateMessages = { ...prev };
            if (!newPrivateMessages[user.id!])
              newPrivateMessages[user.id!] = {
                user,
                messages: [],
                IReadTheirLastMessage: 0,
                TheyReadMyLastMessage: 0,
              };
            newPrivateMessages[user.id!].messages.push({
              sender: user,
              timestamp: Date.now(),
              exiting,
            });

            return newPrivateMessages;
          });
        } else {
          setActiveUsers((prev) => ({ ...prev, [user.id as any]: user }));
        }
        if (!chatIdRef.current) playSound("/discord-notification.mp3");
        setGlobalMessages((prev) => [
          ...prev,
          {
            sender: user,
            timestamp: Date.now(),
            exiting,
          },
        ]);
      }
    );

    socketConnection.on("read", (senderId: string) => {
      console.log("read event received from: ", senderId);
      setPrivateMessages((prev) => {
        const newPrivateMessages = { ...prev };
        if (!newPrivateMessages[senderId!])
          newPrivateMessages[senderId!] = {
            user,
            messages: [],
            IReadTheirLastMessage: 0,
            TheyReadMyLastMessage: 0,
          };
        newPrivateMessages[senderId!].IReadTheirLastMessage =
          newPrivateMessages[senderId!]?.IReadTheirLastMessage || 0;
        newPrivateMessages[senderId!].TheyReadMyLastMessage = Date.now();
        return newPrivateMessages;
      });
    });

    socketConnection.on("message", (message: Message) => {
      if (!message.recipient) {
        if (!chatIdRef.current) playSound("/discord-notification.mp3");
        setGlobalMessages((prev) => {
          return [...prev, message];
        });
      }

      if (message.recipient) {
        const privateMessageId =
          message.sender.id === socketConnection.id
            ? message.recipient.id!
            : message.sender.id!;
        // this means that the frontend user is currently in the same private chatroom as the message sender
        if (chatIdRef.current === privateMessageId)
          playSound("/discord-notification.mp3");
        // Pro React tip: use the callback version of setState when you need to update state based on the previous state
        setPrivateMessages((prev) => {
          const newPrivateMessages = { ...prev };
          if (!newPrivateMessages[privateMessageId])
            newPrivateMessages[privateMessageId] = {
              user: message.sender,
              messages: [],
              // if the user (you) are in the chat then they (you) must have read the last message
              // very situational because (you) will have to be in the private chat when receiving the first message from the other user
              IReadTheirLastMessage:
                chatIdRef.current === privateMessageId ? Date.now() : 0,
              // if (you) didnt send the last message then the sender would have had to have read my last message by default
              TheyReadMyLastMessage:
                message.sender.id !== socketConnection.id ? Date.now() : 0,
            };
          newPrivateMessages[privateMessageId].messages.push(message);
          // if the user (you) are in the chat then they (you) must have read the last message
          if (chatIdRef.current === privateMessageId) {
            newPrivateMessages[privateMessageId].IReadTheirLastMessage =
              Date.now();
            // emit that (you) read their last message unless (you) sent the last message
            if (message.sender.id !== socketConnection.id)
              socketConnection.emit("read", message.sender.id);
          } else {
            newPrivateMessages[privateMessageId].IReadTheirLastMessage = 0;
          }
          return newPrivateMessages;
        });
      }
    });

    socketConnection.on("connect_error", (error) => {
      console.error("Connection Error:", error);
      setSocketError(error.message);
    });

    socketConnection.on("error", (error) => {
      console.error("socketConnectionConnection Error:", error);
      setSocketError(error.message);
    });

    socketConnection.on("disconnect", () => {
      setGlobalMessages((prev) => [
        ...prev,
        {
          sender: user,
          timestamp: Date.now(),
          exiting: true,
        },
      ]);
      setPrivateMessages((prev) => {
        const newPrivateMessages = { ...prev };
        if (!newPrivateMessages[user.id!])
          newPrivateMessages[user.id!] = {
            user,
            messages: [],
            IReadTheirLastMessage: 0,
            TheyReadMyLastMessage: 0,
          };
        newPrivateMessages[user.id!].messages.push({
          sender: user,
          timestamp: Date.now(),
          exiting: true,
        });
        return newPrivateMessages;
      });
      setUser({});
      setSocketConnection(null);
      setActiveUsers({});
      setChatId(undefined);
      setPrivateMessages((prev) => {
        const newPrivateMessages = { ...prev };
        Object.keys(newPrivateMessages).forEach((key) => {
          const lastMessage =
            newPrivateMessages[key].messages[
              newPrivateMessages[key].messages.length - 1
            ];
          if (lastMessage?.exiting) {
            newPrivateMessages[key].messages = [lastMessage];
          } else {
            delete newPrivateMessages[key];
          }
        });
        return newPrivateMessages;
      });
      socketConnection.close();
    });

    return () => {
      socketConnection.off("connect");
      socketConnection.off("update active users");
      socketConnection.off("user status change");
      socketConnection.off("message");
      socketConnection.off("connect_error");
      socketConnection.off("error");
      socketConnection.off("disconnect");
      socketConnection.off("read");
    };
  }, [
    setActiveUsers,
    setChatId,
    setGlobalMessages,
    setPrivateMessages,
    setUser,
    socketConnection,
    user,
  ]);

  useEffect(() => {
    if (!socketConnection || !user.id) return;
  }, [setActiveUsers, setGlobalMessages, setUser, socketConnection, user]);

  return { socketConnection, socketError };
};

export default useSocket;

// console.log(
//   "Sent From: ",
//   message.sender.name,
//   "\nRecieved By: ",
//   !message.recipient ? "GlobalChat" : user.name
// );
