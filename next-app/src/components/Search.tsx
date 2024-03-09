/* eslint-disable @next/next/no-img-element */
import {
  useContext,
  useEffect,
  useRef,
  useDeferredValue,
  useState,
} from "react";

// components
import ModalMenu from "./ModalMenu";

// context
import AppContext from "@/context/AppContext";

// types
import Message from "@/types/messageType";

// data
import avatarList from "@/data/avatarList";
import formatTimestampToTime from "@/lib/formatTimestampToTime";

const Search = () => {
  const {
    modal,
    setModal,
    globalMessages,
    privateMessages,
    setChatId,
    activeUsers,
    mobile,
  } = useContext(AppContext);

  const timeOutRef = useRef<NodeJS.Timeout>();

  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const defferedInput = useDeferredValue(inputValue);

  const [foundMessages, setFoundMessages] = useState<Message[]>([]);

  // search both global and private messages using the deferred value of the input
  useEffect(() => {
    if (!defferedInput) {
      setFoundMessages([]);
      return;
    }
    const matchedGlobalMessages = globalMessages.filter((message) =>
      message.text?.toLowerCase().includes(defferedInput.toLowerCase().trim())
    );
    const matchedPrivateMessages = Object.values(privateMessages)
      .map((data) => data.messages)
      .flat()
      .filter((message) =>
        message.text?.toLowerCase().includes(defferedInput.toLowerCase().trim())
      );
    setFoundMessages(
      [...matchedGlobalMessages, ...matchedPrivateMessages].sort(
        (a, b) => b.timestamp - a.timestamp
      )
    );
  }, [defferedInput, globalMessages, privateMessages]);

  useEffect(() => {
    console.log(foundMessages);
  }, [foundMessages]);

  useEffect(() => {
    clearTimeout(timeOutRef.current);
    if (modal === "search") {
      timeOutRef.current = setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [modal]);

  return (
    <ModalMenu
      active={modal === "search"}
      closeMenu={() => setModal(undefined)}
      side="right"
    >
      <div
        className={`${
          foundMessages.length > 0 ? "mb-2" : ""
        } text-xs sm:text-sm text-center ml-3 pr-3 pb-1 sm:pb-2 mt-2 pt-2 sm:pt-3 opacity-80 dark:opacity-70 w-72 sm:w-[22rem]`}
      >
        <input
          ref={inputRef}
          type="text"
          className="text-xs sm:text-sm w-full h-10 px-3 rounded-lg border border-gray-400/80 dark:border-black/50 outline-none"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      <div
        className={`overflow-y-auto overflow-x-hidden pl-4 pr-5 sm:pl-3 sm:pr-4 mb-2.5 sm:mb-3.5 mr-2.5 h-max flex flex-col w-72 sm:w-[22rem]`}
      >
        {foundMessages.map((message, i) => (
          <div
            key={message.sender.id}
            onClick={() => {
              setChatId(message.sender.id);
              setModal(undefined);
            }}
            className="relative items-start mb-2.5 sm:mb-3 last-of-type:mb-0 group cursor-pointer flex group w-max max-w-full"
          >
            <div className="relative shrink-0">
              <img
                className="h-8 w-8 rounded-full shadow-xl border border-black/20 dark:border-white/05"
                src={`data:image/jpg;base64, ${
                  avatarList[message.sender.avatar ? message.sender.avatar : 0]
                }`}
                alt="activeUser avatar"
              />
              <div
                className={`${
                  activeUsers[message.sender.id!]
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
                ></div>
                <div
                  className={`w-max text-xs underline text-black/85 dark:text-white opacity-90 dark:opacity-75 cursor-pointer pr-4`}
                >
                  {message.sender.name}
                </div>
                <div className="w-full">
                  <p className="mt-[.4rem] sm:mt-[.2rem] text-xs sm:text-sm truncate">
                    {message.text}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`${
                mobile ? "group-active:opacity-100" : "group-hover:opacity-100"
              } opacity-60 dark:opacity-75 pl-2.5 h-full flex flex-col justify-center shrink-0`}
            >
              <div className="h-max dark:text-white/75 text-xs shadow-xl">
                {formatTimestampToTime(message.timestamp)}
              </div>
              <div className="h-max dark:text-white/75 text-xs shadow-xl mt-1.5">
                {message.recipient ? "Private" : "Global"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ModalMenu>
  );
};

export default Search;
