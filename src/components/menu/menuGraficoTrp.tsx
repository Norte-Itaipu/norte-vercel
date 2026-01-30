import React, { useState } from 'react';
import Strings from '../../util/Strings';
import colors from '../../util/colors';

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

  // NOVAS ESTAÇÕES (COM LABEL E VALUE)
  const stations = [
    { value: 'itai', label: 'ITAI (Foz do Iguaçu - PR)' },
    { value: 'prcv', label: 'PRCV (Cascavel – PR)' },
    { value: 'msmn', label: 'MSMN (Mundo Novo - MS)' },
    { value: 'stha', label: 'STHA (Santa Helena - PR)' },
    { value: 'guai', label: 'GUAI (Guaíra - PR)' },
  ];

  return (
    <div
      className="flex flex-col lg:flex-row justify-around p-8 shadow-lg space-y-6 lg:space-y-0 lg:space-x-8 mb-10 shadow-t"
      style={{
        backgroundColor: colors.card,
        borderRadius: '24px',
        border: `2px solid ${colors.border}`,
      }}
    >
      {/* COLUNA 1 */}
      <div className="flex flex-col items-start w-full lg:w-1/3">
        <label className="mb-2 text-lg font-medium" style={{ color: colors.text }}>
          Data de Início:
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mb-4 p-2 rounded-lg w-full shadow-sm"
          style={{
            border: `2px solid ${colors.border}`,
            backgroundColor: colors.background,
            color: colors.text,
          }}
        />

        <div className="mb-2 text-lg font-medium" style={{ color: colors.text }}>
          Eixo X:
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="hora"
              checked={xAxis === 'hora'}
              onChange={() => setXAxis('hora')}
              className="form-radio h-4 w-4"
              style={{ accentColor: colors.button }}
            />
            <span style={{ color: colors.text }}>Data</span>
          </label>
        </div>
      </div>

      {/* COLUNA 2 */}
      <div className="flex flex-col items-start w-full lg:w-1/3">
        <label className="mb-2 text-lg font-medium" style={{ color: colors.text }}>
          Data de Fim:
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mb-4 p-2 rounded-lg w-full shadow-sm"
          style={{
            border: `2px solid ${colors.border}`,
            backgroundColor: colors.background,
            color: colors.text,
          }}
        />

        <div className="mb-2 text-lg font-medium" style={{ color: colors.text }}>
          Eixo Y:
        </div>

        <div className="space-y-3">
          {yOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={value}
                checked={yAxis.includes(value)}
                onChange={() => handleYChange(value)}
                className="form-checkbox h-4 w-4"
                style={{ accentColor: colors.button }}
              />
              <span style={{ color: colors.text }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* COLUNA 3 - ESTAÇÕES E BOTÃO */}
      <div className="flex flex-col items-start w-full lg:w-1/3">
        <div className="mb-2 text-lg font-medium" style={{ color: colors.text }}>
          Estação:
        </div>

        <div className="space-y-3">
          {stations.map(({ value, label }) => (
            <label key={value} className="flex items-center space-x-2">
              <input
                type="radio"
                value={value}
                checked={station === value}
                onChange={() => setStation(value)}
                className="form-radio h-4 w-4"
                style={{ accentColor: colors.button }}
              />
              <span style={{ color: colors.text }}>{label}</span>
            </label>
          ))}
        </div>

        <p
          className="text-sm mt-6 mb-2 text-justify"
          style={{ color: colors.secondaryText }}
        >
          {Strings.menuTrpLegenda}
        </p>

        <button
          onClick={handleGenerateClick}
          className="py-3 px-6 mt-6 rounded-lg shadow-lg transition-colors w-full"
          style={{ backgroundColor: colors.button, color: colors.title }}
        >
          {Strings.buttonGerarGrafico}
        </button>
      </div>
    </div>
  );
};

export default MenuGraficoTrp;
