/* eslint-disable @next/next/no-img-element */
import { useContext, useState, useEffect, useRef } from "react";

// context
import AppContext from "@/context/AppContext";

const FullScreenImage = () => {
  const { fullScreenImage, setFullScreenImage } = useContext(AppContext);

  const [animationState, setAnimationState] = useState<
    "closed" | "opening" | "opened" | "closing"
  >("closed");
  const openingTimeoutRef = useRef<NodeJS.Timeout>();
  const closingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (fullScreenImage.length > 0) {
      setAnimationState("opening");
    }
  }, [fullScreenImage]);

  useEffect(() => {
    console.log(animationState);
    if (animationState === "opening") {
      openingTimeoutRef.current = setTimeout(() => {
        setAnimationState("opened");
      }, 500);
    }
    if (animationState === "closing") {
      closingTimeoutRef.current = setTimeout(() => {
        setAnimationState("closed");
        setFullScreenImage("");
      }, 300);
    }
    return () => {
      clearTimeout(openingTimeoutRef.current!);
      clearTimeout(closingTimeoutRef.current!);
    };
  }, [animationState, setFullScreenImage]);

  return (
    <div
      className={`${
        fullScreenImage.length > 0
          ? "pointer-events-auto"
          : "pointer-events-none"
      } absolute w-screen h-lvh flex items-start z-50`}
    >
      <div
        className={`
        ${
          (animationState === "opening" || animationState === "opened") &&
          "opacity-100 duration-500 ease-out"
        }
        ${
          (animationState === "closing" || animationState === "closed") &&
          "opacity-0 duration-300 ease-in"
        }
        absolute w-full h-[200vh] bg-black/20 dark:bg-black/60 backdrop-blur`}
        onClick={() => setAnimationState("closing")}
      />
      <div
        className={`w-full h-dvh flex justify-center items-center transition-all`}
      >
        <img
          src={fullScreenImage}
          alt="full screen"
          className={`
          ${
            animationState === "closed" &&
            fullScreenImage.length > 0 &&
            "-translate-x-[150%] scale-125 opacity-90"
          }
          ${
            animationState === "opening" &&
            fullScreenImage.length > 0 &&
            "opacity-100 duration-500 ease-out"
          }
          ${animationState === "opened" && "opacity-100"}
          ${
            animationState === "closing" &&
            "opacity-0 translate-x-full scale-[60%] duration-300 ease-in blur-xl"
          }
          ${
            animationState === "closed" &&
            fullScreenImage.length === 0 &&
            "hidden"
          }
          z-10 max-w-[80%] max-h-[80vh] rounded-xl shadow-2xl border border-black/20 dark:border-white/10`}
        />
      </div>
    </div>
  );
};

export default FullScreenImage;
