/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef, useContext, useCallback } from "react";

import TextareaAutosize from "react-textarea-autosize";

// context
import AppContext from "@/context/AppContext";

// data
import avatarList from "@/data/avatarList";

// hooks
import useImage from "@/hooks/useImage";

// types
import Message from "@/types/messageType";

// styles
import styles from "@/styles/scrollbar.module.scss";

function extractURL(text: string): string | undefined {
  const urlRegex = /https?:\/\/[^\s]+/;
  const match = text.match(urlRegex);
  return match ? match[0] : undefined;
}

const ChatInput = ({
  submitMessage,
  scrollIsAtBottom,
  scrollToBottom,
  scrollContainerRef,
  scrollBarWidth,
  imageScrollDown,
  setImageScrollDown,
}: {
  submitMessage: (message: Message) => void;
  scrollIsAtBottom: boolean;
  scrollToBottom: (behavior: "smooth" | "instant") => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  scrollBarWidth: number;
  imageScrollDown: boolean;
  setImageScrollDown: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, darkMode, globalMessages, mobile, modal } =
    useContext(AppContext);

  const [text, setText] = useState<string>("");

  const [focused, setFocused] = useState(false);
  const [scrollIsAtBottomDelay, setScrollIsAtBottomDelay] = useState(false);
  const scrollIsAtBottomDelayTimeoutRef = useRef<NodeJS.Timeout>();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const {
    image,
    loadImage,
    loadingImage,
    setErrorLoadingImage,
    errorLoadingImage,
    removeImage,
  } = useImage();

  const onSubmit = useCallback(() => {
    if (!/[^\s]/.test(textareaRef.current?.value as string) && !image) return;

    const url = extractURL(text);

    submitMessage({
      text: text.trim(),
      timestamp: Date.now(),
      type: "global",
      user: user!,
      image,
      url,
    });
    setText("");
    removeImage();
  }, [image, removeImage, submitMessage, text, user]);

  const scrollToBottomForNewMessage = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    const textareaContainer = textareaRef.current;
    if (!scrollContainer || !textareaContainer) return;

    if (
      scrollContainer.lastChild instanceof Element &&
      scrollContainer.scrollHeight -
        scrollContainer.clientHeight -
        scrollContainer.scrollTop <
        (scrollContainer.lastChild as Element).clientHeight +
          textareaContainer.clientHeight +
          40
    ) {
      scrollToBottom("instant");
    }
  }, [scrollContainerRef, scrollToBottom]);

  useEffect(() => {
    const input = imageInputRef.current;
    input?.addEventListener("change", loadImage);
    return () => {
      input?.removeEventListener("change", loadImage);
    };
  }, [loadImage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [image]);

  useEffect(() => {
    if (image)
      imageInputRef.current?.value && (imageInputRef.current.value = "");
  }, [image]);

  useEffect(() => {
    const textareaContainer = textareaRef.current;
    if (!textareaContainer) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };
    textareaContainer.addEventListener("keydown", handleKeyDown);
    return () => {
      textareaContainer.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSubmit]);

  useEffect(() => {
    if (scrollIsAtBottom) {
      setScrollIsAtBottomDelay(true);
    } else {
      scrollIsAtBottomDelayTimeoutRef.current = setTimeout(() => {
        setScrollIsAtBottomDelay(false);
      }, 300);
    }
    return () => {
      clearTimeout(scrollIsAtBottomDelayTimeoutRef.current as NodeJS.Timeout);
    };
  }, [scrollIsAtBottom]);

  useEffect(() => {
    // on screen resize suchh as mobile keyboard opening then scroll to bottom, use event listener
    const handleResize = () => {
      mobile &&
        scrollIsAtBottomDelay &&
        modal !== "search" &&
        scrollToBottom("instant");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobile, modal, scrollIsAtBottomDelay, scrollToBottom]);

  useEffect(() => {
    scrollToBottomForNewMessage();
    const audio = new Audio("/discord-notification.mp3");
    audio.play();
  }, [globalMessages, scrollToBottomForNewMessage]);

  useEffect(() => {
    if (imageScrollDown) {
      scrollToBottom("instant");
      setImageScrollDown(false);
    }
  }, [imageScrollDown, scrollToBottom, setImageScrollDown]);

  return (
    <>
      <input
        onClick={(e) => {
          e.stopPropagation();
        }}
        ref={imageInputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
      />
      <div
        className={`${
          darkMode ? styles.darkScroll : styles.lightScroll
        } relative flex pb-3 w-full flex-col`}
      >
        <div
          className={`
          ${
            scrollIsAtBottom
              ? "ease-in opacity-0 duration-150"
              : "ease-out opacity-100 duration-300"
          } 
          ${!image ? "pr-4" : "pr-[7.5rem]"}
          absolute flex justify-end items-center -top-11 w-full h-10`}
          style={{
            transform: `translate(-${
              scrollBarWidth ? scrollBarWidth / 4 - 2.25 : 0
            }rem, ${scrollIsAtBottom ? "2.5rem" : "0"})`,
          }}
        >
          <div
            onClick={() => scrollToBottom("smooth")}
            className={`${
              mobile ? "active:scale-110" : "hover:scale-110"
            } h-8 w-8 flex justify-center items-center rounded-full bg-white dark:bg-white/40 shadow shadow-black/20 backdrop-blur transition-all cursor-pointer group`}
          >
            <i
              className={`${
                mobile ? "group-active:text-black" : "group-hover:text-black"
              } fa-solid fa-arrow-down text-black/75 transition-colors`}
            />
          </div>
        </div>
        {image && (
          <div
            className="absolute flex flex-row-reverse right-0"
            style={{
              transform: `translate(-${
                scrollBarWidth ? scrollBarWidth / 4 - 1.25 : 1.25
              }rem, -100%)`,
            }}
          >
            <div
              onClick={() => removeImage()}
              className={`${
                mobile
                  ? "active:border-black/20 active:bg-white dark:active:bg-white/[65%] active:text-black"
                  : "hover:border-black/20 hover:bg-white dark:hover:bg-white/[65%] hover:text-black"
              } z-10 cursor-pointer absolute -top-2 -right-1.5 h-[1.3rem] w-[1.3rem] border border-black/15 bg-white/90 dark:bg-white/50 shadow dark:shadow-black/30 backdrop-blur rounded-full flex justify-center items-center text-[.7rem] text-black transition-all ease-out duration-150`}
            >
              <i className="fa-solid fa-times" />
            </div>
            <img
              src={image}
              alt="preview"
              className={`aspect-square w-16 object-cover object-center rounded-md select-none border border-black/25 dark:border-white/25 will-change-transform bg-white dark:bg-zinc-700`}
              onError={removeImage}
            />
          </div>
        )}
        <div className="flex px-4 sm:px-5 mt-3">
          <img
            className="h-8 w-8 sm:w-8 sm:h-8 rounded-full cursor-pointer shadow-xl mr-2"
            src={`data:image/jpg;base64, ${avatarList[user?.avatar!]}`}
            alt="avatar"
          />
          <div
            onFocus={(e) => {
              setFocused(true);
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFocused(true);
              textareaRef.current?.focus();
            }}
            // ref={commentInputref}
            className={`relative flex-1 min-h-8 rounded-2xl bg-white dark:bg-zinc-700 dark:caret-white dark:text-white border border-neutral-600/60 cursor-text pl-3 pr-1.5 flex flex-col text-black overflow-hidden transition-all`}
          >
            <TextareaAutosize
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={10000}
              minRows={1}
              maxRows={7}
              placeholder={`Write a message...`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFocused(true);
                textareaRef.current?.focus();
              }}
              className={`
              ${
                // if it is scrollable
                (textareaRef.current?.scrollHeight || 0) > 140 &&
                (textareaRef.current?.scrollHeight || 0) >
                  (textareaRef.current?.clientHeight || 0)
                  ? "overflow-y-scroll"
                  : "overflow-hidden"
              }
              mt-1 outline-none h-full resize-none decoration-none bg-transparent w-full text-sm`}
              style={{
                lineHeight: "1.25rem",
              }}
            />
            <div
              onClick={() => textareaRef.current?.focus()}
              className={`${
                focused || textareaRef.current?.value
                  ? "h-6 opacity-100"
                  : "h-0 opacity-0"
              } transition-all ease-out duration-150 flex flex-row-reverse w-full items-center`}
            >
              <i
                onClick={onSubmit}
                className={`
                ${
                  focused || textareaRef.current?.value
                    ? "scale-100"
                    : "scale-0"
                }
                ${
                  /[^\s]/.test(textareaRef.current?.value as string) || image
                    ? `${
                        mobile
                          ? "dark:active:text-white active:text-blue-600"
                          : "dark:hover:text-white hover:text-blue-600"
                      } dark:text-white/80 text-black/75 cursor-pointer`
                    : "text-black/40 dark:text-white/25 cursor-not-allowed"
                } 
                ml-2.5 fa-solid fa-share transition-all ease-out duration-150`}
              />
              <i
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  imageInputRef.current?.click();
                }}
                className={`
                ${
                  focused || textareaRef.current?.value
                    ? "scale-100"
                    : "scale-0"
                }
                ${
                  mobile
                    ? "dark:active:text-white active:text-blue-600"
                    : "dark:hover:text-white hover:text-blue-600"
                }
                dark:text-white/80 text-black/75 cursor-pointer fa-solid fa-image transition-all ease-out duration-150`}
              />
            </div>
          </div>
          <div className={`h-8 flex items-center`}>
            <i
              onClick={() => {
                if (image) onSubmit();
                else imageInputRef.current?.click();
              }}
              className={`
              ${
                focused || textareaRef.current?.value
                  ? "hidden opacity-0 w-0 scale-x-0"
                  : "opacity-100 ml-2 scale-x-100"
              } 
              ${image ? "fa-share" : `fa-image`}
              ${
                mobile
                  ? "dark:active:text-white active:text-blue-600"
                  : "dark:hover:text-white hover:text-blue-600"
              }
              cursor-pointer fa-solid transition-all ease-linear duration-150 dark:text-white/80 text-black/75`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
