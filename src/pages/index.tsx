import React from "react";
import Strings from "../util/Strings";
import colors from "../util/colors";
import Head from "next/head";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Image from "next/image";
import FeaturedNews from "@/components/FeaturedNews";

export default function Home() {
  return (
    <div className="overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Head>
        <title>{Strings.norteTitle}</title>
        <meta name="theme-color" content={colors.background} />
      </Head>

      <div style={{ 
        backgroundColor: colors.header, 
        color: colors.text,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center py-2 px-4">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
          </div>
          <div className="md:w-1/6">
            <div className="relative h-32 md:h-32 w-full">
            </div>
          </div>
        </div>
      </div>

      <div id="sobre-o-projeto" className="py-20" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div style={{ 
                backgroundColor: colors.card, 
                border: `1px solid ${colors.border}`
              }} className="p-8 rounded-xl shadow-lg">
                <h2 style={{ color: colors.title }} className="text-3xl font-bold mb-6">
                  {Strings.sobreProjetoSectionTitle}
                </h2>
                <p style={{ color: colors.text }} className="text-lg leading-relaxed text-justify">
                  {Strings.sobreProjetoText}
                </p>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="relative min-h-[250px] md:min-h-[380px] w-full mx-auto">
                <Image
                  src="/images/GPS.png"
                  alt="Planeta Terra com dados meteorológicos"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturedNews />

      <ScrollToTopButton text={Strings.voltarTopo} />
    </div>
  );
}