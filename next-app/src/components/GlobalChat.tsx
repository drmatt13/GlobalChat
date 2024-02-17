import { useContext, useState, useCallback, useEffect, useRef } from "react";

// components
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

// context
import AppContext from "@/context/AppContext";

// types
import Message from "@/types/messageType";

const GlobalChat = () => {
  const { socketConnection, globalMessages } = useContext(AppContext);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [scrollIsAtBottom, setScrollIsAtBottom] = useState<boolean>(true);
  const [scrollbarWidth, setScrollbarWidth] = useState<number>(0);

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
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollToBottom]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom("instant");
    }, 10);
    setTimeout(() => {
      scrollToBottom("instant");
    }, 25);
    setTimeout(() => {
      scrollToBottom("instant");
    }, 50);
  }, [scrollToBottom]);

  const submitMessage = useCallback(
    (message: Message) => {
      socketConnection?.emit("global message", message);
      scrollToBottom("instant");
    },
    [scrollToBottom, socketConnection]
  );

  return (
    <div className="relative flex-1 flex justify-center overflow-clip">
      <div className="h-full w-full flex flex-col ">
        <div
          className="w-full flex-1 flex flex-col overflow-y-scroll px-4"
          ref={scrollContainerRef}
        >
          {globalMessages.map((message, index) => (
            <ChatMessage message={message} key={index} />
          ))}
        </div>
        <div className="w-full shrink-0 z-10">
          <ChatInput
            submitMessage={submitMessage}
            scrollIsAtBottom={scrollIsAtBottom}
            scrollToBottom={scrollToBottom}
            scrollContainerRef={scrollContainerRef}
            scrollBarWidth={scrollbarWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalChat;
