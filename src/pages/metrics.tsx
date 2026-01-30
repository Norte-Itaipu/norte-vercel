import React, { useState, useRef, useEffect } from "react";
import Strings from "../util/Strings";
import colors from "../util/colors";
import Head from "next/head";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import dynamic from "next/dynamic";
import Button from "@/components/common/Button";

const GeradorGrafico = dynamic(
  () => import("../components/Geradores/geradorgraficoIon"),
  { ssr: false, loading: () => <div className="text-center py-10" style={{color: colors.text}}>Carregando gráfico</div> }
);

const GeradorGraficoTrp = dynamic(
  () => import("../components/Geradores/geradorgraficoTrp"),
  { ssr: false, loading: () => <div className="text-center py-10" style={{color: colors.text}}>Carregando gráfico</div> }
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
    <div className="overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Head>
        <title>{Strings.norteTitlePageMetrics}</title>
        <meta name="description" content="Dados e métricas meteorológicas " />
      </Head>

      <div className="text-[#ced3dd] border-b" style={{ backgroundColor: colors.header, borderColor: colors.border }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center py-4 px-4">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
          </div>
          <div className="md:w-1/2">
            <div className="relative h-32 md:h-32 w-full">
            </div>
          </div>
        </div>
      </div>

      <div
        ref={metricsRef}
        id="metrics-objetivo-do-projeto"
        className="py-16"
        style={{ backgroundColor: colors.background }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2 p-8 rounded-xl shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: '1px' }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: colors.title }}>
                {Strings.metricasAbordadasTitle}
              </h2>
              <ul className="space-y-3">
                {Strings.parametrosIonosfericosList.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2" style={{ color: colors.button }}>•</span>
                    <span style={{ color: colors.text }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-1/2 p-8 rounded-xl shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: '1px' }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: colors.title }}>
                {Strings.metricasIonosfericasTitle3}
              </h2>
              <p className="mb-6 leading-relaxed text-justify" style={{ color: colors.text }}>
                {Strings.sobreProjetoText}
              </p>
              <Button 
                onClick={() => setTipoGrafico('ion')} 
                className="hover:bg-[#4a8a82]"
                style={{ backgroundColor: colors.button, color: colors.title }}
              >
                {Strings.buttonMetricasIon}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={troposfericasRef}
        id="metrics-troposfericas"
        className="py-16"
        style={{ backgroundColor: colors.background }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2 order-2 md:order-1 p-8 rounded-xl shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: '1px' }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: colors.title }}>
                {Strings.metricasIonosfericasTitle4}
              </h2>
              <div className="flex justify-center md:justify-start">
                <Button 
                  onClick={() => setTipoGrafico('trp')} 
                  className="px-8 py-3 hover:bg-[#4a8a82]"
                  style={{ backgroundColor: colors.button, color: colors.title }}
                >
                  {Strings.buttonMetricasTrp}
                </Button>
              </div>
            </div>

            <div className="md:w-1/2 order-1 md:order-2 p-8 rounded-xl shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: '1px' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.title }}>
                {Strings.metricasAbordadasTitle}
              </h3>
              <ul className="space-y-3 mb-6">
                {Strings.metricasList.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2" style={{ color: colors.button }}>•</span>
                    <span style={{ color: colors.text }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-right text-justify" style={{ color: colors.text }}>
                {Strings.sobreProjetoText2}
              </p>
            </div>
          </div>
        </div>
      </div>

      {tipoGrafico && (
        <div ref={apiChartRef} className="py-16 border-t" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
          <div className="container mx-auto px-4">
            <div className="p-6 rounded-xl shadow-md" style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: '1px' }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold" style={{ color: colors.title }}>
                  {tipoGrafico === 'ion' ? 'Gráficos Ionosféricos' : 'Gráficos Troposféricos'}
                </h3>
                <Button 
                  onClick={handleHideCharts}
                  className="hover:bg-[#747981]"
                  style={{ backgroundColor: colors.secondaryText, color: colors.background }}
                >
                  {Strings.voltar}
                </Button>
              </div>
              
              <div className="p-5 rounded-lg flex justify-center" style={{ backgroundColor: colors.background }}>
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