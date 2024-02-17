/* eslint-disable @next/next/no-img-element */
import { useContext } from "react";

// context
import AppContext from "@/context/AppContext";

const FullScreenImage = () => {
  const { fullScreenImage, setFullScreenImage } = useContext(AppContext);

  return (
    <div className="absolute w-screen h-screen bg-black/20 dark:bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="absolute w-full h-full"
        onClick={() => setFullScreenImage("")}
      />
      <img
        src={fullScreenImage}
        alt="full screen"
        className="z-10 max-w-[95%] max-h-[90vh] rounded-lg"
      />
    </div>
  );
};

export default FullScreenImage;
