import React from "react";
import Strings from "../util/Strings";
import Head from "next/head";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Image from "next/image";
import FeaturedNews from "@/components/FeaturedNews";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Head>
        <title>{Strings.norteTitle}</title>
        <meta name="theme-color" content="#0A4DA6" />
      </Head>

      {/* Header Section - Azul Profundo */}
      <div className="bg-gradient-to-b from-[#0A4DA6] to-[#082C5F] text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center py-2 px-4">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
            {/* <h1 className="text-2xl md:text-2xl font-bold leading-tight">
              {Strings.nucleoReferenciaTitle}
            </h1> */}
            {/* <p className="mt-6 text-lg text-blue-100 opacity-90">
              Dados meteorológicos precisos
            </p> */}
          </div>
          <div className="md:w-1/6">
            <div className="relative h-32 md:h-32 w-full">
              {/* <Image
                src="/images/web_fig_graph.png"
                alt="Visualização de dados meteorológicos"
                fill
                className="object-contain"
                priority
              /> */}
            </div>
          </div>
        </div>
      </div>

      {/* About Section - Fundo claro com detalhes azuis */}
      <div id="sobre-o-projeto" className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-[#E3EFFB]">
                <h2 className="text-3xl font-bold text-[#0A4DA6] mb-6">
                  {Strings.sobreProjetoSectionTitle}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed text-justify">
                  {Strings.sobreProjetoText}
                </p>
                
                {/* <div className="mt-12">
                  <h2 className="text-3xl font-bold text-[#0A4DA6] mb-6">
                    {Strings.objetivosProjetoTitle}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed text-justify">
                    {Strings.objetivosProjetoText}
                  </p>
                </div> */}
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="relative h-96 w-full mx-auto">
                <Image
                  src="/images/GPS.png"
                  alt="Planeta Terra com dados meteorológicos"
                  fill
                  className="object-cover"
                  priority
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0A4DA6]/30 to-transparent" /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Notícias em Destaque */}
      <FeaturedNews />

      <ScrollToTopButton text={Strings.voltarTopo} />
    </div>
  );
}