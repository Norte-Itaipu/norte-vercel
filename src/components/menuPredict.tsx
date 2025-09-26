import React, { useEffect, useState } from 'react';

interface MenuProps {
  onChangeStation: (station: string) => void;
  currentStation?: string;
}

const MenuPredict: React.FC<MenuProps> = ({
  onChangeStation,
  currentStation = 'ITAI',
}) => {
  const [station, setStation] = useState<string>(currentStation);

  useEffect(() => {
    onChangeStation(station);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station]);

  const stations = ['ITAI', 'GUAI', 'PRUR'];

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 16,
      }}
    >
      <div style={{ fontWeight: 600 }}>Estação:</div>
      {stations.map((s) => (
        <label
          key={s}
          style={{ display: 'flex', gap: 6, alignItems: 'center' }}
        >
          <input
            type="radio"
            name="station"
            value={s}
            checked={station === s}
            onChange={() => setStation(s)}
          />
          <span>{s}</span>
        </label>
      ))}
    </div>
  );
};

export default MenuPredict;
