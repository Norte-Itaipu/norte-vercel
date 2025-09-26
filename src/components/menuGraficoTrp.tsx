import React, { useState } from 'react';
import Strings from '../util/Strings';

interface MenuProps {
  onGenerate: (params: {
    startDate: string;
    endDate: string;
    xAxis: string;
    yAxis: string[];
    station: string;
  }) => void;
}

const MenuGraficoTrp: React.FC<MenuProps> = ({ onGenerate }) => {
  const [startDate, setStartDate] = useState<string>('2025-01-30');
  const [endDate, setEndDate] = useState<string>('2025-01-30');
  const [xAxis, setXAxis] = useState<string>('hora');
  const [yAxis, setYAxis] = useState<string[]>(['IWV']);
  const [station, setStation] = useState<string>('guai');

  const handleGenerateClick = () => {
    onGenerate({ startDate, endDate, xAxis, yAxis, station });
  };

  const handleYChange = (value: string) => {
    if (yAxis.includes(value)) {
      setYAxis(yAxis.filter((item) => item !== value));
    } else if (yAxis.length < 2) {
      setYAxis([...yAxis, value]);
    } else {
      setYAxis([yAxis[1], value]);
    }
  };

  const yOptions = [
    { value: 'pressao', label: 'Pressão' },
    { value: 'temperatura', label: 'Temperatura' },
    { value: 'umidade', label: 'Umidade' },
    { value: 'ZTD', label: 'ZTD (Zenith Total Delay)' },
    { value: 'ZTH', label: 'ZTH (Zenith Tropospheric Height)' },
    { value: 'ZTW', label: 'ZTW (Zenith Total Water Vapor)' },
    { value: 'IWV', label: 'IWV (Integrated Water Vapor)' },
    { value: 'PWV', label: 'PWV (Precipitable Water Vapor)' },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-around bg-white p-8 rounded-lg shadow-lg space-y-6 lg:space-y-0 lg:space-x-8 mb-10 shadow-t">
      <div className="flex flex-col items-start w-full lg:w-1/3">
        <label className="mb-2 text-gray-600 text-lg font-medium">Data de Início:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border-2 border-gray-300 mb-4 p-2 rounded-lg w-full shadow-sm"
        />
        <div className="mb-2 text-gray-600 text-lg font-medium">Eixo X:</div>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="hora"
              checked={xAxis === 'hora'}
              onChange={() => setXAxis('hora')}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="text-gray-600">Data</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col items-start w-full lg:w-1/3">
        <label className="mb-2 text-gray-600 text-lg font-medium">Data de Fim:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border-2 border-gray-300 mb-4 p-2 rounded-lg w-full shadow-sm"
        />
        <div className="mb-2 text-gray-600 text-lg font-medium">Eixo Y:</div>
        <div className="space-y-3">
          {yOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={value}
                checked={yAxis.includes(value)}
                onChange={() => handleYChange(value)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-gray-600">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start w-full lg:w-1/3">
        <div className="mb-2 text-gray-600 text-lg font-medium">Estação:</div>
        <div className="space-y-3">
          {['guai', 'itai'].map((label) => (
            <label key={label} className="flex items-center space-x-2">
              <input
                type="radio"
                value={label}
                checked={station === label}
                onChange={() => setStation(label)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="text-gray-600">{label.toUpperCase()}</span>
            </label>
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-6 mb-2 text-justify">{Strings.menuTrpLegenda}</p>

        <button
          onClick={handleGenerateClick}
          className="bg-blue-500 text-white py-3 px-6 mt-6 rounded-lg shadow-lg hover:bg-blue-600 transition-colors w-full"
        >
          {Strings.buttonGerarGrafico}
        </button>
      </div>
    </div>
  );
};

export default MenuGraficoTrp;
