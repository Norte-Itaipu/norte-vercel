import React, { useState, useRef, useEffect } from "react";
import Strings from "../util/Strings";
import Head from "next/head";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import dynamic from "next/dynamic";
import Image from "next/image";
import Button from "@/components/common/Button";

// Carregamento dinâmico dos componentes de gráficos
const GeradorGrafico = dynamic(
  () => import("../components/Geradores/geradorgraficoIon"),
  { ssr: false, loading: () => <div className="text-center py-10">Carregando gráfico...</div> }
);

const GeradorGraficoTrp = dynamic(
  () => import("../components/Geradores/geradorgraficoTrp"),
  { ssr: false, loading: () => <div className="text-center py-10">Carregando gráfico...</div> }
);

const Metrics: React.FC = () => {
  const [tipoGrafico, setTipoGrafico] = useState<'ion' | 'trp' | null>(null);
  const apiChartRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const troposfericasRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (tipoGrafico && apiChartRef.current) {
      apiChartRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [tipoGrafico]);

  const handleHideCharts = () => {
    setTipoGrafico(null);
    if (troposfericasRef.current) {
      troposfericasRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="overflow-hidden bg-gray-50">
      <Head>
        <title>{Strings.norteTitlePageMetrics}</title>
        <meta name="description" content="Dados e métricas meteorológicas " />
      </Head>

      <div className="bg-gradient-to-b from-[#0A4DA6] to-[#082C5F] text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center py-4 px-4">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
            {/* <h1 className="text-2xl md:text-2xl font-bold leading-tight">
              {Strings.metricasIonosfericasTitle}
            </h1> */}
            {/* <p className="mt-6 text-lg text-blue-100 opacity-90">
              Dados meteorológicos precisos
            </p> */}
          </div>
          <div className="md:w-1/2">
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

      {/* Seção Métricas Ionosféricas */}
      <div
        ref={metricsRef}
        id="metrics-objetivo-do-projeto"
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2 bg-blue-50 p-8 rounded-xl shadow-sm border border-blue-100">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
                {Strings.metricasAbordadasTitle}
              </h2>
              <ul className="space-y-3">
                {Strings.parametrosIonosfericosList.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
                {Strings.metricasIonosfericasTitle3}
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed text-justify">
                {Strings.sobreProjetoText}
              </p>
              <Button 
                onClick={() => setTipoGrafico('ion')} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {Strings.buttonMetricasIon}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Métricas Troposféricas */}
      <div
        ref={troposfericasRef}
        id="metrics-troposfericas"
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2 order-2 md:order-1 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
                {Strings.metricasIonosfericasTitle4}
              </h2>
              <div className="flex justify-center md:justify-start">
                <Button 
                  onClick={() => setTipoGrafico('trp')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  {Strings.buttonMetricasTrp}
                </Button>
              </div>
            </div>

            <div className="md:w-1/2 order-1 md:order-2 bg-blue-50 p-8 rounded-xl shadow-sm border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                {Strings.metricasAbordadasTitle}
              </h3>
              <ul className="space-y-3 mb-6">
                {Strings.metricasList.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-700 text-right text-justify">
                {Strings.sobreProjetoText2}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Gráficos */}
      {tipoGrafico && (
        <div ref={apiChartRef} className="py-16 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800">
                  {tipoGrafico === 'ion' ? 'Gráficos Ionosféricos' : 'Gráficos Troposféricos'}
                </h3>
                <Button 
                  onClick={handleHideCharts}
                  className="bg-red-400 hover:bg-gray-300 text-gray-800"
                >
                  {Strings.voltar}
                </Button>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg flex justify-center">
                {isClient && tipoGrafico === 'ion' && <GeradorGrafico />}
                {isClient && tipoGrafico === 'trp' && <GeradorGraficoTrp />}
              </div>
            </div>
          </div>
        </div>
      )}

      <ScrollToTopButton text={Strings.voltarTopo} />
    </div>
  );
};

export default Metrics;