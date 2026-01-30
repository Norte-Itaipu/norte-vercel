import colors from '@/util/colors';
import React, { useState } from 'react';

interface MenuProps {
  onGenerate: (station: string) => void;
  station: string;
  onChangeStation: (station: string) => void;
}

const MenuPredict: React.FC<MenuProps> = ({
  onGenerate,
  station,
  onChangeStation,
}) => {

  // ESTAÇÕES COM LABEL BONITO + VALUE LIMPO
  const stations = [
    { value: 'ITAI', label: 'ITAI (Foz do Iguaçu - PR)' },
    { value: 'GUAI', label: 'GUAI (Guaíra - PR)' },
    { value: 'PRUR', label: 'PRUR (Umuarama – PR)' },
    { value: 'STHA', label: 'STHA (Santa Helena - PR)' },
  ];

  const handleClick = () => {
    onGenerate(station);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: colors.title }}>
        <div style={{ fontWeight: 600 }}>Estação:</div>

        {stations.map(({ value, label }) => (
          <label key={value} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              type="radio"
              name="station"
              value={value}
              checked={station === value}
              onChange={() => onChangeStation(value)}
            />
            <span>{label}</span>
          </label>
        ))}

      </div>

      <button
        onClick={handleClick}
        style={{
          backgroundColor: '#61a299',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          padding: '8px 16px',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Buscar predição
      </button>
    </div>
  );
};

export default MenuPredict;