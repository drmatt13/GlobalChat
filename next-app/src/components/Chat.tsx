import { useContext, useState, useCallback, useEffect, useRef } from "react";

// components
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

// context
import AppContext from "@/context/AppContext";

// types
import Message from "@/types/messageType";

const Chat = () => {
  const {
    socketConnection,
    globalMessages,
    chatId,
    privateMessages,
    activeUsers,
  } = useContext(AppContext);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [scrollIsAtBottom, setScrollIsAtBottom] = useState<boolean>(true);
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);

  const [imageScrollDown, setImageScrollDown] = useState<boolean>(false);

  const scrollToBottom = useCallback((behavior: "smooth" | "instant") => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior,
    });
  }, []);

  useEffect(() => {
    scrollToBottom("instant");
  }, [chatId, scrollToBottom]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const element = scrollContainerRef.current;
      const width = element.offsetWidth - element.clientWidth;
      setScrollbarWidth(width);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (
        scrollContainer.scrollHeight -
          scrollContainer.clientHeight -
          scrollContainer.scrollTop <
        2
      ) {
        setScrollIsAtBottom(true);
      } else {
        setScrollIsAtBottom(false);
      }
    };
    scrollContainer.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scrollToBottom]);

  useEffect(() => {
    if (
      !chatId &&
      globalMessages.length > 0 &&
      globalMessages[globalMessages.length - 1].sender.id ===
        socketConnection?.id
    )
      scrollToBottom("instant");
  }, [chatId, globalMessages, scrollToBottom, socketConnection?.id]);

  useEffect(() => {
    if (
      chatId &&
      privateMessages[chatId]?.messages &&
      privateMessages[chatId].messages[
        privateMessages[chatId].messages.length - 1
      ]?.sender.id === socketConnection?.id
    )
      scrollToBottom("instant");
  }, [chatId, privateMessages, scrollToBottom, socketConnection?.id]);

  const submitMessage = useCallback(
    (message: Message) => socketConnection?.emit("message", message),
    [socketConnection]
  );

  const [chatInitTime, setChatInitTime] = useState<number>(
    new Date().getTime()
  );

  return (
    <div className="relative flex-1 flex justify-center overflow-hidden">
      <div className="w-full flex flex-col">
        <div
          className={`${
            chatId && !activeUsers[chatId] ? "pb:2.5 sm:pb-3" : "pb-[3px]"
          } w-full flex-1 flex flex-col overflow-y-scroll overflow-x-hidden pl-4 pr-24`}
          ref={scrollContainerRef}
        >
          {!chatId &&
            globalMessages.map((message, index) => (
              <ChatMessage
                message={message}
                setImageScrollDown={setImageScrollDown}
                key={index}
              />
            ))}
          {chatId &&
            privateMessages[chatId]?.messages &&
            privateMessages[chatId].messages.map((message, index) => (
              <ChatMessage
                message={message}
                setImageScrollDown={setImageScrollDown}
                key={index}
              />
            ))}
          {chatId &&
            privateMessages[chatId]?.messages.length === 0 &&
            !activeUsers[chatId] && (
              <ChatMessage
                message={{
                  sender: {
                    id: "system",
                    name: privateMessages[chatId].user.name,
                  },
                  timestamp: chatInitTime,
                  exiting: true,
                }}
                setImageScrollDown={setImageScrollDown}
              />
            )}
        </div>
        {!(chatId && !activeUsers[chatId]) && (
          <ChatInput
            submitMessage={submitMessage}
            scrollIsAtBottom={scrollIsAtBottom}
            scrollToBottom={scrollToBottom}
            scrollContainerRef={scrollContainerRef}
            scrollBarWidth={scrollbarWidth}
            imageScrollDown={imageScrollDown}
            setImageScrollDown={setImageScrollDown}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
