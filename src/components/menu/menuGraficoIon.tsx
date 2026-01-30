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
    elevacaoInicial: number;
    elevacaoFinal: number;
  }) => void;
}

const MenuGraficoIon: React.FC<MenuProps> = ({ onGenerate }) => {
  const [startDate, setStartDate] = useState<string>('2020-01-01');
  const [endDate, setEndDate] = useState<string>('2020-01-02');
  const [xAxis, setXAxis] = useState<string>('Data');
  const [yAxis, setYAxis] = useState<string[]>(['I']);
  const [station, setStation] = useState<string>('ITAI');
  const [elevacaoInicial, setElevacaoInicial] = useState<number>(0);
  const [elevacaoFinal, setElevacaoFinal] = useState<number>(90);

  const handleGenerateClick = () => {
    onGenerate({ startDate, endDate, xAxis, yAxis, station, elevacaoInicial, elevacaoFinal });
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
    { value: 'I', label: 'I (atraso ionosférico)' },
    { value: 'Fp', label: 'Fp (índice de irregularidades)' },
    { value: 'ROTI', label: 'ROTI (Índice de Variação do TEC)' },
    { value: 'g', label: 'g (gradiente ionosférico)' },
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
        <label className="mb-2 text-lg font-medium" style={{ color: colors.text }}>Data de Início:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mb-4 p-2 rounded-lg w-full shadow-sm"
          style={{ border: `2px solid ${colors.border}`, backgroundColor: colors.background, color: colors.text }}
        />

        <div className="mb-2 text-lg font-medium" style={{ color: colors.text }}>Eixo X:</div>
        <div className="space-y-3">
          {[
            'Data',
            'I (atraso ionosférico)',
            'Fp (índice de irregularidades)',
            'ROTI (Índice de Variação do TEC)',
            'g (gradiente ionosférico)',
          ].map((label) => {
            const value = label.split(' ')[0];
            return (
              <label key={value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={value}
                  checked={xAxis === value}
                  onChange={() => setXAxis(value)}
                  className="form-radio h-4 w-4"
                  style={{ accentColor: colors.button }}
                />
                <span style={{ color: colors.text }}>{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* COLUNA 2 */}
      <div className="flex flex-col items-start w-full lg:w-1/3">
        <label className="mb-2 text-lg font-medium" style={{ color: colors.text }}>Data de Fim:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mb-4 p-2 rounded-lg w-full shadow-sm"
          style={{ border: `2px solid ${colors.border}`, backgroundColor: colors.background, color: colors.text }}
        />

        <div className="mb-2 text-lg font-medium" style={{ color: colors.text }}>Eixo Y:</div>
        <div className="space-y-3">
          {yOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={yAxis.includes(value)}
                onChange={() => handleYChange(value)}
                className="form-radio h-4 w-4"
                style={{ accentColor: colors.button }}
              />
              <span style={{ color: colors.text }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* COLUNA 3 – ESTAÇÕES */}
      <div className="flex flex-col items-start w-full lg:w-1/3">
        <div className="mb-2 text-lg font-medium" style={{ color: colors.text }}>Estação:</div>
        <div className="space-y-3">
          {[
            { value: 'ITAI', label: 'ITAI (Foz do Iguaçu - PR)' },
            { value: 'PRCV', label: 'PRCV (Cascavel – PR)' },
            { value: 'MSMN', label: 'MSMN (Mundo Novo - MS)' },
            { value: 'STHA', label: 'STHA (Santa Helena - PR)' },
            { value: 'GUAI', label: 'GUAI (Guaíra - PR)' },
          ].map(({ value, label }) => (
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

        <p className="text-sm mt-6 mb-2 text-justify" style={{ color: colors.secondaryText }}>
          {Strings.menuIonLegenda}
        </p>

        <div className="mt-6 w-full">
          <label className="mb-2 text-lg font-medium" style={{ color: colors.text }}>Elevação Inicial:</label>
          <input
            type="number"
            step="0.1"
            value={elevacaoInicial}
            onChange={(e) => setElevacaoInicial(parseFloat(e.target.value))}
            className="mb-4 p-2 rounded-lg w-full shadow-sm"
            style={{ border: `2px solid ${colors.border}`, backgroundColor: colors.background, color: colors.text }}
          />
        </div>

        <div className="w-full">
          <label className="mb-2 text-lg font-medium" style={{ color: colors.text }}>Elevação Final:</label>
          <input
            type="number"
            step="0.1"
            value={elevacaoFinal}
            onChange={(e) => setElevacaoFinal(parseFloat(e.target.value))}
            className="mb-4 p-2 rounded-lg w-full shadow-sm"
            style={{ border: `2px solid ${colors.border}`, backgroundColor: colors.background, color: colors.text }}
          />
        </div>

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

export default MenuGraficoIon;
