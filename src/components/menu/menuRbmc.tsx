import React, { useState } from 'react';
import estacoes from '@/data/estacoesRBMC.json';

interface MenuRbmcProps {
  onGenerate: (params: { date: string; station: string }) => void;
}

const MenuRbmc: React.FC<MenuRbmcProps> = ({ onGenerate }) => {
  const [date, setDate] = useState('');
  const [station, setStation] = useState('');

  const handleClick = () => {
    onGenerate({ date, station });
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around bg-white p-8 rounded-lg shadow-lg space-y-6 lg:space-y-0 lg:space-x-8 mb-10">
      <div className="flex flex-col items-start w-full lg:w-1/3">
        <label className="mb-2 text-gray-600 text-lg font-medium">Data:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-2 border-gray-300 mb-4 p-2 rounded-lg w-full shadow-sm"
        />
      </div>

      <div className="flex flex-col items-start w-full lg:w-1/3">
        <label className="mb-2 text-gray-600 text-lg font-medium">Estação RBMC:</label>
        <select
          value={station}
          onChange={(e) => setStation(e.target.value)}
          className="border-2 border-gray-300 mb-4 p-2 rounded-lg w-full shadow-sm"
        >
          <option value="">Selecione uma estação</option>
          {estacoes.map((e) => (
            <option key={e.sigla} value={e.sigla}>
              {e.sigla} – {e.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-start w-full lg:w-1/3">
        <button
          onClick={handleClick}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-colors w-full"
        >
          Baixar dados
        </button>
      </div>
    </div>
  );
};

export default MenuRbmc;
