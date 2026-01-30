import NewsSectionLocal from "@/components/NewsSectionLocal";
import React from "react";
import colors from "@/util/colors";

export const noticias: React.FC = () => {

  const workshopLinks = [
   { title: "Workshop Novembro/2025 - Link ainda não disponibilizado", url: "#" },
  ];

  return (
    <>
      <div
        style={{
          backgroundColor: colors.header,
          color: colors.text,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center py-2 px-4">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10"></div>
          <div className="md:w-1/6">
            <div className="relative h-32 md:h-32 w-full"></div>
          </div>
        </div>
      </div>

      {/* <div className="container mx-auto px-4 mt-10">
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.header }}>
          Workshops
        </h2>

        {workshopLinks.length === 0 ? (
          <p className="text-gray-400 italic">Nenhum workshop disponível no momento.</p>
        ) : (
          <ul className="list-disc ml-6 space-y-2">
            {workshopLinks.map((item, index) => (
              <li key={index}>
                <a
                  href={item.url}
                  className="text-blue-500 hover:text-blue-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div> */}

      <NewsSectionLocal />
    </>
  );
};

export default noticias;
