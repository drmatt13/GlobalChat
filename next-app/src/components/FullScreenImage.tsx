/* eslint-disable @next/next/no-img-element */
import { useContext, useState, useEffect, useRef } from "react";

// context
import AppContext from "@/context/AppContext";

const FullScreenImage = () => {
  const { fullScreenImage, setFullScreenImage, mobile } =
    useContext(AppContext);

  const [initialScreenHeight, setInitialScreenHeight] = useState<number>(0);

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

  useEffect(() => {
    // on the first render, set the initial screen height
    if (initialScreenHeight === 0) {
      setInitialScreenHeight(window.innerHeight);
    }
  }, [initialScreenHeight]);

  return (
    <div
      className={`${
        fullScreenImage.length > 0
          ? "pointer-events-auto"
          : "pointer-events-none"
      } absolute top-0 w-full h-lvh flex items-start z-50 overflow-hidden`}
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
        absolute w-full h-[200vh] bg-black/75 dark:bg-black/80 backdrop-blur`}
        onClick={() => setAnimationState("closing")}
      />
      <div
        className={`w-full h-dvh flex justify-center items-center transition-all`}
        style={{
          minHeight: `${mobile ? initialScreenHeight + "px" : "100dvh"}`,
        }}
      >
        <img
          src={fullScreenImage}
          alt="full screen"
          className={`
          ${
            animationState === "closed" &&
            fullScreenImage.length > 0 &&
            "-translate-x-[160%] scale-150 opacity-75 blur-sm"
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
          z-10 w-max max-w-[80%] sm:max-w-[34rem] md:max-w-[38rem] lg:max-w-[42rem] xl:max-w-[46rem] max-h-[80%] rounded-xl md:rounded-2xl xl:rounded-3xl shadow-2xl border border-black/10 dark:border-black/20 bg-white/25 dark:bg-zinc-500/20 backdrop-blur-2xl`}
        />
      </div>
    </div>
  );
};

export default FullScreenImage;
