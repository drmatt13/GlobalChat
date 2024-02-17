/* eslint-disable @next/next/no-img-element */
import { useContext, Fragment } from "react";

// context
import AppContext from "@/context/AppContext";

// data
import avatarList from "@/data/avatarList";

// types
import Message from "@/types/messageType";

const isValidUrl = (string: string): boolean => {
  // Check if the string starts with "http://" or "https://"
  if (!/^https?:\/\/.+/i.test(string)) {
    return false;
  }

  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const ChatMessage = ({ message }: { message: Message }) => {
  const { setFullScreenImage } = useContext(AppContext);

  return (
    <div className="flex mt-2.5 sm:mt-3 w-full">
      {!message.image && !message.text && !message.urls ? (
        <p className="text-xs sm:text-sm">
          {message.exiting ? (
            <>
              <span className="font-bold text-red-700 dark:text-red-600">
                {message.user.name}
              </span>{" "}
              has left the chat
            </>
          ) : (
            <>
              <span className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400 underline cursor-pointer">
                {message.user.name}
              </span>{" "}
              has joined the chat!
            </>
          )}
        </p>
      ) : (
        <>
          <img
            className="h-8 w-8 sm:w-10 sm:h-10 rounded-full cursor-pointer shadow-xl"
            src={`data:image/jpg;base64, ${avatarList[message.user?.avatar!]}`}
            alt="sdf"
          />
          <div
            className="ml-2 flex flex-col items-start"
            style={{
              maxWidth: "calc(100% - 3rem)",
            }}
          >
            {message.text && (
              <div className="w-max max-w-full min-w-28 min-h-8 flex flex-col rounded-xl px-3 py-2 bg-white dark:bg-zinc-700 shadow">
                <div className="w-max text-xs underline text-black/85 hover:text-black dark:text-white opacity-90 dark:opacity-75 hover:opacity-100 dark:hover:opacity-100 cursor-pointer">
                  {message.user?.name}
                </div>
                <div className="w-full">
                  <p className="mt-[.4rem] sm:mt-[.2rem] text-xs sm:text-sm break-words whitespace-pre-wrap">
                    {message.text.split("\n").map((line, index) => (
                      <Fragment key={index}>
                        {/* Split line into words and process each word */}
                        {line.split(" ").map((word, wordIndex) => {
                          // Check if the word is a valid URL
                          const isUrl = isValidUrl(word);
                          return (
                            <Fragment key={wordIndex}>
                              {/* Wrap URLs with <a> tag, otherwise just display the word */}
                              {isUrl ? (
                                <a
                                  href={word}
                                  className="text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400 underline cursor-pointer visited:text-purple-600 dark:visited:text-purple-400 visited:hover:text-purple-500 dark:visited:hover:text-purple-300"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {word}
                                </a>
                              ) : (
                                word
                              )}
                              {/* Add a space after each word except the last one */}
                              {wordIndex < line.split(" ").length - 1
                                ? " "
                                : ""}
                            </Fragment>
                          );
                        })}
                        {/* Add a <br/> element after each line except the last one */}
                        {index < message.text!.split("\n").length - 1 && <br />}
                      </Fragment>
                    ))}
                  </p>
                </div>
              </div>
            )}

            {message.image && (
              <img
                src={message.image}
                alt="uploaded"
                className={`${
                  message.text && "mt-2"
                } max-w-full max-h-[35vh] rounded-xl cursor-pointer bg-white dark:bg-zinc-700 shadow-sm`}
                onClick={() => setFullScreenImage(message.image!)}
              />
            )}

            {!message.image && message.og?.url && (
              <>
                <div
                  onClick={() =>
                    window.open(
                      message.og!.url,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className={`${
                    message.text && "mt-2"
                  } rounded-lg overflow-hidden flex flex-col w-[26rem] sm:w-[28rem] max-w-full text-xs md:text-sm`}
                >
                  {message.og.image?.[0]?.url && (
                    <img
                      src={message.og.image[0].url}
                      alt={message.og.image[0].url}
                      className="cursor-pointer select-none h-12 min-h-52 sm:min-h-[15rem] max-w-full sm:max-h-[35vh] object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex-1 text-left p-2 overflow-hidden text-xs bg-white dark:bg-zinc-700 shadow-sm text-neutral-700 dark:text-neutral-200 cursor-pointer">
                    {message.og.siteName && (
                      <p className="w-full h-[1.125rem] truncate">
                        {message.og.siteName}
                      </p>
                    )}
                    {message.og.title && (
                      <p className="w-full h-[1.125rem] font-bold truncate">
                        {message.og.title}
                      </p>
                    )}
                    {message.og.description && (
                      <p className="hidden sm:inline-block w-full h-[1.125rem] truncate">
                        {message.og.description}
                      </p>
                    )}
                    {message.og.url && !message.og.siteName && (
                      <p className="w-full h-[1.125rem] truncate">
                        {decodeURI(message.og.url || "")}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatMessage;
