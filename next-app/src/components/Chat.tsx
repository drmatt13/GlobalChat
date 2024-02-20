import { useContext, useState, useCallback, useEffect, useRef } from "react";

// components
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

// context
import AppContext from "@/context/AppContext";

// types
import Message from "@/types/messageType";

const GlobalChat = ({
  type,
  id,
}: {
  type: "global" | "private";
  id?: string;
}) => {
  const { socketConnection, globalMessages } = useContext(AppContext);

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
    if (globalMessages.length > 0) {
      const lastMessage = globalMessages[globalMessages.length - 1];
      if (lastMessage.user.id === socketConnection?.id) {
        scrollToBottom("instant");
      }
    }
  }, [scrollToBottom, globalMessages, socketConnection?.id]);

  const submitMessage = useCallback(
    (message: Message) => socketConnection?.emit("message", message),
    [socketConnection]
  );

  return (
    <div className="relative flex-1 flex justify-center overflow-hidden">
      <div className="w-full flex flex-col">
        <div
          className="w-full flex-1 flex flex-col overflow-y-scroll px-4 pb-1"
          ref={scrollContainerRef}
        >
          {globalMessages.map((message, index) => (
            <ChatMessage
              message={message}
              setImageScrollDown={setImageScrollDown}
              key={index}
            />
          ))}
        </div>
        <ChatInput
          submitMessage={submitMessage}
          scrollIsAtBottom={scrollIsAtBottom}
          scrollToBottom={scrollToBottom}
          scrollContainerRef={scrollContainerRef}
          scrollBarWidth={scrollbarWidth}
          imageScrollDown={imageScrollDown}
          setImageScrollDown={setImageScrollDown}
        />
      </div>
    </div>
  );
};

export default GlobalChat;
