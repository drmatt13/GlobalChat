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

function extractURLs(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = text.match(urlRegex);
  return urls ? urls : [];
}

const ChatInput = ({
  submitMessage,
  scrollIsAtBottom,
  scrollToBottom,
  scrollContainerRef,
  scrollBarWidth,
}: {
  submitMessage: (message: Message) => void;
  scrollIsAtBottom: boolean;
  scrollToBottom: (behavior: "smooth" | "instant") => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  scrollBarWidth: number;
}) => {
  const { user, darkMode, globalMessages } = useContext(AppContext);

  const [text, setText] = useState<string>("");

  const [focused, setFocused] = useState(false);

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

    const urls = extractURLs(text);

    console.log({
      text: text.trim(),
      timestamp: Date.now(),
      user: user!,
      image,
      urls,
    });

    submitMessage({
      text: text.trim(),
      timestamp: Date.now(),
      user: user!,
      image,
      urls,
    });
    setText("");
    removeImage();
  }, [image, removeImage, submitMessage, text, user]);

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
    if (image)
      imageInputRef.current?.value && (imageInputRef.current.value = "");
  }, [image]);

  useEffect(() => {
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
          25
    ) {
      scrollToBottom("instant");
    }
    const audio = new Audio("/discord-notification.mp3");
    audio.play();
  }, [scrollContainerRef, scrollToBottom, globalMessages]);

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
            className={`h-8 w-8 flex justify-center items-center rounded-full bg-white dark:bg-white/40 shadow shadow-black/20 backdrop-blur transition-all hover:scale-110 cursor-pointer group`}
          >
            <i className="fa-solid fa-arrow-down text-black/75 group-hover:text-black transition-colors" />
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
              className="cursor-pointer absolute -top-2 -right-1.5 h-[1.3rem] w-[1.3rem] border border-black/30 hover:border-black/50 bg-white dark:bg-white/40 shadow dark:hover:bg-white/60 dark:shadow-black/30 backdrop-blur rounded-full flex justify-center items-center text-[.7rem] text-black hover:text-black  transition-all ease-out duration-150"
            >
              <i className="fa-solid fa-times" />
            </div>
            <img
              src={image}
              alt="preview"
              className={`aspect-square w-16 object-cover object-center rounded-md bg-white select-none border border-black/25`}
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
                    ? "dark:text-white/80 dark:hover:text-white text-black/75 hover:text-blue-600 cursor-pointer"
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
                dark:text-white/80 dark:hover:text-white text-black/75 hover:text-blue-600 cursor-pointer fa-solid fa-image transition-all ease-out duration-150`}
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
              ${
                image ? "fa-share" : `fa-image`
              } cursor-pointer fa-solid transition-all ease-linear duration-150 dark:text-white/80 dark:hover:text-white text-black/75 hover:text-blue-600`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
