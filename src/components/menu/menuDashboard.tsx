import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Strings from '../../util/Strings';

interface MenuProps {
  onGenerate: (params: { startDate: string; endDate: string; station: string }) => void;
}

const MenuDashboard: React.FC<MenuProps> = ({ onGenerate }) => {
  const [startDate, setStartDate] = useState<string>('2020-01-01');
  const [endDate, setEndDate] = useState<string>('2020-01-02');
  const [station, setStation] = useState<string>('ITAI');

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMapClick = (point: any) => {
    setStation(point.customdata);
  };

  const handleGenerateClick = () => {
    onGenerate({ startDate, endDate, station });
  };

  const stations = [
    { lat: '-25.54', lon: '-54.59', name: 'ITAI', label: 'Foz do Iguaçu' },
    { lat: '-24.96', lon: '-53.47', name: 'PRCV', label: 'Cascavel' },
    { lat: '-23.89', lon: '-54.21', name: 'MSMN', label: 'Mundo Novo' },
  ];

  const mapHeight = 400; 
  const mapWidth = windowWidth < 768 ? windowWidth - 40 : 700; 

  return (
    <div className="flex flex-col lg:flex-row justify-around bg-white p-8 rounded-lg shadow-lg space-y-6 lg:space-y-0 lg:space-x-8 mb-10 shadow-t">
      <div className="flex flex-col items-start w-full lg:w-1/3">
        <label className="mb-2 text-gray-600 text-lg font-medium">{Strings.menuDashboardDataInicio}</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border-2 border-gray-300 mb-4 p-2 rounded-lg w-full shadow-sm"
        />
        <label className="mb-2 text-gray-600 text-lg font-medium">{Strings.menuDashboardDataFim}</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border-2 border-gray-300 mb-4 p-2 rounded-lg w-full shadow-sm"
        />
        <p className="mt-4 text-lg text-gray-700">{Strings.menuDashboardEstacaoSelecionada}<strong>{station}</strong></p>
        <button onClick={handleGenerateClick} className="bg-blue-500 text-white py-2 px-4 mt-6 rounded-lg shadow-lg hover:bg-blue-600 transition-colors">
        {Strings.buttonGerarGrafico}
        </button>
      </div>
      <div className="flex flex-col items-start w-full lg:w-1/2">
        <Plot
          data={[
            {
              type: 'scattermapbox',
              mode: 'markers',
              marker: {
                size: 10,
                color: stations.map(st => st.name === station ? 'red' : 'blue'),
              },
              lat: stations.map(st => st.lat),
              lon: stations.map(st => st.lon),
              customdata: stations.map(st => st.name),
              text: stations.map(st => st.label),
              hoverinfo: 'text',
              showlegend: false,
            },
          ]}
          layout={{
            mapbox: {
              style: 'open-street-map',
              center: { lat: -24.54, lon: -54.59 },
              zoom: 5,
            },
            height: mapHeight,
            width: mapWidth,
            margin: { t: 0, b: 0 },
          }}
          onClick={(event) => handleMapClick(event.points[0])}
        />
      </div>
    </div>
  );
};

export default MenuDashboard;
