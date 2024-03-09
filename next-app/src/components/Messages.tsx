/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState, useRef } from "react";

// components
import ModalMenu from "./ModalMenu";

// context
import AppContext from "@/context/AppContext";

// data
import avatarList from "@/data/avatarList";

// lib
import formatTimestampToTime from "@/lib/formatTimestampToTime";
import playSound from "@/lib/playSound";

// styles
import styles from "@/styles/animations.module.scss";

const Messages = () => {
  const {
    modal,
    setModal,
    privateMessages,
    darkMode,
    mobile,
    activeUsers,
    setChatId,
    user,
  } = useContext(AppContext);

  const [messages, setMessages] = useState<
    Array<(typeof privateMessages)[string]>
  >(
    Object.entries(privateMessages)
      .map(([id, data]) => data)
      .filter(
        (data) =>
          data.messages.length > 1 ||
          (data.messages.length === 1 && !data.messages[0].exiting)
      )
  );

  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(false);

  const initialLoadRef = useRef<boolean>(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modal !== "messages") return;
    const initialLoad = initialLoadRef.current;
    setMessages((prev) => {
      const messageOrder = Object.entries(privateMessages)
        .map(([id, data]) => data)
        .filter(
          (data) =>
            data.messages.length > 1 ||
            (data.messages.length === 1 && !data.messages[0].exiting)
        )
        .sort((a, b) => {
          const aTime = a.messages[a.messages.length - 1].exiting
            ? a.messages[a.messages.length - 2].timestamp
            : a.messages[a.messages.length - 1].timestamp;
          const bTime = b.messages[b.messages.length - 1].exiting
            ? b.messages[b.messages.length - 2].timestamp
            : b.messages[b.messages.length - 1].timestamp;
          return bTime - aTime;
        });
      if (
        !initialLoad &&
        modal === "messages" &&
        !(
          messageOrder[0] &&
          Boolean(
            messageOrder[0].messages[messageOrder[0].messages.length - 1]
              .exiting
          )
        )
      ) {
        playSound("/happy-pop-3-185288.mp3");
        setTimeout(() => {
          const element = messagesContainerRef.current?.firstChild
            ?.childNodes[1].firstChild?.firstChild?.firstChild as HTMLElement;
          // add animation class
          element.classList.add(styles.animatePulseOnce);
          // trigger reflow
          element.style.animation = "none";
          element.offsetHeight;
          element.style.animation = "none";
          element.style.animation = "";
          // remove animation class using a promise
          setTimeout(() => {
            element.classList.remove(styles.animatePulseOnce);
          }, 150);
        }, 1);
      }
      return messageOrder;
    });
    initialLoadRef.current = false;
  }, [modal, privateMessages, user?.id]);

  useEffect(() => {
    if (modal !== "messages") {
      initialLoadRef.current = true;
    }
  }, [modal, messages]);

  return (
    <ModalMenu
      active={modal === "messages"}
      closeMenu={() => setModal(undefined)}
      side="right"
    >
      {/* <div className="w-72 sm:w-[22rem] h-96"> */}
      {messages.length === 0 ? (
        <div className="text-xs sm:text-sm text-center pb-1 sm:pb-2 pt-2 sm:pt-3 my-2 opacity-80 dark:opacity-70 w-72 sm:w-[22rem]">
          Your inbox is empty 😔
        </div>
      ) : (
        <>
          <div className="text-xs sm:text-sm text-center underline pb-1 sm:pb-2 pt-2 sm:pt-3 my-2 opacity-80 dark:opacity-70 w-72 sm:w-[22rem]">
            Messages
          </div>

          <div
            className={`overflow-y-auto overflow-x-hidden pl-4 pr-5 sm:pl-3 sm:pr-4 mb-2.5 sm:mb-3.5 mr-2.5 h-max flex flex-col w-72 sm:w-[22rem]`}
            ref={messagesContainerRef}
          >
            {messages.map((message, i) => (
              <div
                key={message.user.id}
                onClick={() => {
                  setChatId(message.user.id);
                  setModal(undefined);
                }}
                className="relative items-start mb-2.5 sm:mb-3 last-of-type:mb-0 group cursor-pointer flex group w-max max-w-full"
              >
                <div className="relative shrink-0">
                  <img
                    className="h-8 w-8 rounded-full shadow-xl border border-black/20 dark:border-white/05"
                    src={`data:image/jpg;base64, ${
                      avatarList[message.user.avatar ? message.user.avatar : 0]
                    }`}
                    alt="activeUser avatar"
                  />
                  <div
                    className={`${
                      activeUsers[message.user.id!]
                        ? "bg-green-500 dark:border-green-600 dark:border-2 border-green-600"
                        : "bg-red-500 border-red-900 dark:border-red-800"
                    } absolute top-[1.5rem] right-0 w-[.5rem] h-[.5rem] rounded-full border`}
                  />
                </div>

                <div className="ml-2 flex flex-col items-start justify-center min-w-28 overflow-hidden w-max">
                  <div
                    className={`${
                      mobile
                        ? "group-active:opacity-100"
                        : "group-hover:opacity-100"
                    } relative opacity-75 dark:opacity-75 flex-1 w-full flex flex-col px-3 py-2 bg-white dark:bg-zinc-700 rounded-lg`}
                  >
                    <div
                      className={`w-full h-full absolute top-0 left-0 rounded-lg shadow border border-gray-800/20 pointer-events-none`}
                    >
                      <div
                        className={`${styles.animatePulseOnce} opacity-0 w-full h-full bg-black/15 dark:bg-white/25 rounded-lg`}
                      />
                    </div>
                    <div
                      className={`w-max text-xs underline text-black/85 dark:text-white opacity-90 dark:opacity-75 cursor-pointer pr-4`}
                    >
                      {message.user.name}
                    </div>
                    <div className="w-full">
                      <p className="mt-[.4rem] sm:mt-[.2rem] text-xs sm:text-sm truncate">
                        {message.messages[message.messages.length - 1].exiting
                          ? message.messages[message.messages.length - 2].sender
                              .id === user?.id
                            ? `You: ${
                                message.messages[message.messages.length - 2]
                                  .text || "sent a photo"
                              }`
                            : `${
                                message.messages[message.messages.length - 2]
                                  .text || "Sent a photo"
                              }`
                          : message.messages[message.messages.length - 1].sender
                              .id === user?.id
                          ? `You: ${
                              message.messages[message.messages.length - 1]
                                .text || "sent a photo"
                            }`
                          : `${
                              message.messages[message.messages.length - 1]
                                .text || "Sent a photo"
                            }`}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    mobile
                      ? "group-active:opacity-100"
                      : "group-hover:opacity-100"
                  } opacity-60 dark:opacity-75 pl-2.5 h-full flex flex-col justify-center shrink-0`}
                >
                  <div className="h-max dark:text-white/75 text-xs shadow-xl">
                    {formatTimestampToTime(
                      message.messages[message.messages.length - 1].exiting
                        ? message.messages[message.messages.length - 2]
                            .timestamp
                        : message.messages[message.messages.length - 1]
                            .timestamp
                    )}
                  </div>
                  <div className="h-max dark:text-white/75 text-xs shadow-xl mt-1.5">
                    {messages[i].user.id === user?.id
                      ? "sent"
                      : message.messages[message.messages.length - 1].sender
                          .id === user?.id
                      ? // if the last message was sent by the me, compare the time they read my last message and the timestamp from the last message
                        privateMessages[message.user.id!]
                          .TheyReadMyLastMessage >
                        message.messages[message.messages.length - 1].timestamp
                        ? "Seen"
                        : "Unseen"
                      : // if the last message was sent by the other user
                      privateMessages[message.user.id!].IReadTheirLastMessage >
                        0
                      ? "Read"
                      : "Unread"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* </div> */}
    </ModalMenu>
  );
};

export default Messages;
