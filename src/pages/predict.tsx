import React, { useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Strings from "@/util/Strings";
import Button from "@/components/common/Button";

const GeradorPredict = dynamic(
  () => import("../components/Geradores/geradorPredict"),
  { ssr: false }
);

export default function PredictPage() {
  const metricsRef = useRef(null);
  
  return (
    <div className="overflow-hidden">
      <Head>
        <title>{Strings.norteTitle}</title>
        <meta name="theme-color" content="#0A4DA6" />
      </Head>

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
      
      <div
        ref={metricsRef}
        id="metrics-objetivo-do-projeto"
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2 bg-blue-50 p-8 rounded-xl shadow-sm border border-blue-100">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
                Métrica abordada
              </h2>
              <ul className="space-y-3">
                {Strings.parametrosIonosfericosList2.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
                <p className="text-gray-700 mb-6 leading-relaxed text-justify">
                  Ampliando as capacidades de nossa plataforma, introduzimos o sistema de predição do ROTI (Índice da Taxa de Variação do TEC). Esta nova funcionalidade utiliza as métricas ionosféricas coletadas continuamente pelas estações da RBMC-MET na região oeste do Paraná para antecipar o comportamento da ionosfera.
                </p>
              </ul>
            </div>

            <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
                Predição do Índice de Variação do TEC (ROTI)
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed text-justify">
                Utilizando modelos computacionais avançados que analisam os dados históricos, a plataforma agora gera uma predição da atividade ionosférica para os três dias subsequentes. A cada três dias, o sistema é realimentado com novos dados, iniciando um novo ciclo de predição e garantindo que as informações fornecidas sejam sempre atualizadas e precisas.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed text-justify">
               Essa capacidade de previsão de irregularidades ionosféricas representa uma ferramenta valiosa para a comunidade científica e tecnológica, permitindo a antecipação de possíveis impactos em sistemas de navegação e comunicação que dependem dos sinais de satélites GNSS.
              </p>
              <Button 
                onClick={() => {}} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {Strings.buttonMetricasIon}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 bg-white rounded-xl shadow mt-20">
        <h1 className="text-2xl font-bold mb-4">Previsão ROTI</h1>
        <GeradorPredict />
      </div>
      <ScrollToTopButton text="Voltar ao topo" />
    </div>
  );
}
