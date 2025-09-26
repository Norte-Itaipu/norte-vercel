import React, { useState } from "react";
import Header from "../components/Header";
import Strings from "../util/Strings";
import Head from "next/head";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import dynamic from "next/dynamic";
import Button from "@/components/common/Button";

const GeradorDashboard = dynamic(
  () => import("../components/Geradores/geradordashboard"),
  {
    ssr: false,
  }
);

const Dashboard: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClear = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="overflow-hidden">
      <Head>
        <title>{Strings.norteTitleDashboard}</title>
      </Head>

      <div className="bg-black text-white">
        <div className="container mx-auto flex items-center md:w-3/6">
          <div className="mt-12 mr-2">
            <h1 className="text-4xl md:text-5xl font-bold">
              {Strings.tituloDashboard}
            </h1>
          </div>

          <div className="mx-auto mb-8 mt-16 flex-shrink-0">
            <img
              src="/images/dashboard.png"
              alt="Satélite"
              className="w-full h-auto max-w-[200px] mx-auto"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto text-center">
        <div className="bg-white p-5 mt-10">
          <GeradorDashboard key={refreshKey} />
          <Button
            onClick={handleClear}
            className="mt-5 bg-red-500 hover:bg-red-600"
          >
            Limpar
          </Button>
        </div>
      </div>

      <ScrollToTopButton text={Strings.voltarTopo} />
    </div>
  );
};

export default Dashboard;
