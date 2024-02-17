import React from "react";

const page = () => {
  return (
    <div className="bg-black/50 w-full h-screen flex justify-center items-start pt-12">
      <div className="w-[95%] bg-white flex">
        <div className="w-12 h-12 bg-black flex-shrink-0" />
        <p
          className="w-full break-words"
          style={{
            maxWidth: "calc(100% - 3rem)",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit
          doloremque expedita ad minus natus corrupti harum deleniti iusto
          dicta, libero exercitationem rem neque nesciunt? Quis, eos pariatur!
          Blanditiis, quibusdam sapiente.
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaz
        </p>
      </div>
    </div>
  );
};

export default page;
