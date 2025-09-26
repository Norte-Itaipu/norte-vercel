import NewsSectionLocal from "@/components/NewsSectionLocal";
import React from "react";

export const noticias: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-b from-[#0A4DA6] to-[#082C5F] text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center py-2 px-4">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
          </div>
          <div className="md:w-1/6">
            <div className="relative h-32 md:h-32 w-full">
            </div>
          </div>
        </div>
      </div>
      <NewsSectionLocal />
    </>
  );
};

export default noticias;
