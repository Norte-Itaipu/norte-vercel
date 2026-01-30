import React, { useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Strings from "@/util/Strings";
import colors from "@/util/colors";
import Button from "@/components/common/Button";

const GeradorPredict = dynamic(
  () => import("../components/Geradores/geradorPredict"),
  { ssr: false }
);

export default function PredictPage() {
  const metricsRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<HTMLDivElement | null>(null);


  const handleScrollToGraph = () => {
    graphRef.current?.scrollIntoView({ behavior: "smooth" });
  };


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

      <div
        ref={metricsRef}
        id="metrics-objetivo-do-projeto"
        className="py-16"
        style={{ backgroundColor: colors.background }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div style={{
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`
            }} className="p-8 rounded-xl shadow-sm">
              <h2 style={{ color: colors.title }} className="text-2xl md:text-3xl font-bold mb-6">
                Métrica abordada
              </h2>
              <ul className="space-y-3">
                {Strings.parametrosIonosfericosList2.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span style={{ color: colors.button }} className="mr-2">•</span>
                    <span style={{ color: colors.text }}>{item}</span>
                  </li>
                ))}
                <p style={{ color: colors.text }} className="mb-6 leading-relaxed text-justify">
                  Ampliando as capacidades de nossa plataforma, introduzimos o sistema de predição do ROTI (Índice da Taxa de Variação do TEC). Esta nova funcionalidade utiliza as métricas ionosféricas coletadas continuamente pelas estações da RBMC-MET na região oeste do Paraná para antecipar o comportamento da ionosfera.
                </p>
              </ul>
            </div>

            <div style={{
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`
            }} className="p-8 rounded-xl shadow-sm">
              <h2 style={{ color: colors.title }} className="text-2xl md:text-3xl font-bold mb-6">
                Predição do Índice de Variação do TEC (ROTI)
              </h2>
              <p style={{ color: colors.text }} className="mb-6 leading-relaxed text-justify">
                Utilizando modelos computacionais avançados que analisam os dados históricos, a plataforma agora gera uma predição da atividade ionosférica para os três dias subsequentes. A cada três dias, o sistema é realimentado com novos dados, iniciando um novo ciclo de predição e garantindo que as informações fornecidas sejam sempre atualizadas e precisas.
              </p>
              <p style={{ color: colors.text }} className="mb-6 leading-relaxed text-justify">
                Essa capacidade de previsão de irregularidades ionosféricas representa uma ferramenta valiosa para a comunidade científica e tecnológica, permitindo a antecipação de possíveis impactos em sistemas de navegação e comunicação que dependem dos sinais de satélites GNSS.
              </p>
              <Button
                onClick={handleScrollToGraph}
                style={{
                  backgroundColor: colors.button,
                  color: colors.title
                }}
                className="hover:bg-[#4a8a82]"
              >
                {Strings.buttonMetricasIon}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={graphRef}
        style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}
        className="container mx-auto p-6 rounded-xl shadow mt-20"
      >
        <h1 style={{ color: colors.title }} className="text-2xl font-bold mb-4">Previsão ROTI</h1>
        <GeradorPredict />
      </div>
      <ScrollToTopButton text="Voltar ao topo" />
    </div>
  );
}