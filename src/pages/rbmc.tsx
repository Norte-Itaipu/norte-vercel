import React from 'react';
import GeradorRbmc from '@/components/geradores/geradorRbmc';

const RbmcPage = () => {
  return (
    <div className="container mx-auto px-6 pt-40 pb-10">
      <h1 className="text-3xl font-bold text-[#0A4DA6] mb-6">Download de Dados RBMC (IBGE)</h1>
      <p className="text-lg text-gray-700 mb-8">
        Baixe dados GNSS da Rede Brasileira de Monitoramento Contínuo (RBMC) do IBGE.
        Escolha uma data e uma estação para acessar os arquivos disponíveis.
      </p>
      <GeradorRbmc />
    </div>
  );
};

export default RbmcPage;
