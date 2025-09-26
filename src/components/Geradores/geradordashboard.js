import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import MenuDashboard from '../menuDashboard';
import LoadingWrapper from '../loadingWrapper';

const GeradorDashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState({
    startDate: '',
    endDate: '',
    station: 'ITAI'
  });
  const [showLegends, setShowLegends] = useState([]); // Array para controle de legendas individuais
  const [plotDimensions, setPlotDimensions] = useState({
    width: window.innerWidth > 768 ? 700 : window.innerWidth * 0.9,
    height: window.innerWidth > 768 ? 500 : 400
  });

  useEffect(() => {
    const handleResize = () => {
      setPlotDimensions({
        width: window.innerWidth > 768 ? 700 : window.innerWidth * 0.9,
        height: window.innerWidth > 768 ? 500 : 400
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { startDate, endDate, station } = params;
        if (!startDate || !endDate) return;
        setIsLoading(true);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const ionUrls = [];
        const gtsUrls = [];
        start.setDate(start.getDate() + 1);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const year = d.getFullYear();
          const startOfYear = new Date(year, 0, 0);
          const diff = (d - startOfYear) + ((startOfYear.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
          const doy = Math.floor(diff / (1000 * 60 * 60 * 24));
          ionUrls.push(`https://v250y1kckj.execute-api.us-east-1.amazonaws.com/metrics?source=dw&ano=${year}&estacao=${station}&tipo_coleta=ion&doy=${String(doy).padStart(3, '0')}`);
          gtsUrls.push(`https://v250y1kckj.execute-api.us-east-1.amazonaws.com/metrics?source=dw&ano=${year}&estacao=${station}&tipo_coleta=gts&doy=${String(doy).padStart(3, '0')}`);
        }

        const fetchIonData = await Promise.all(ionUrls.map(url => axios.get(url)));
        const allIonData = fetchIonData.flatMap(response => response.data.content);
        const fetchGtsData = await Promise.all(gtsUrls.map(url => axios.get(url)));
        const allGtsData = fetchGtsData.flatMap(response => response.data.content);
        const combinedData = [...allIonData, ...allGtsData];
        const metrics = ['I', 'Fp', 'ROTI', 'g'];
        
        const plots = metrics.map(metric => {
          const satelites = [...new Set(combinedData.map(item => item.satelite))];
          return satelites.map((satelite, index) => {
            const sateliteData = combinedData.filter(item => item.satelite === satelite);
            return {
              x: sateliteData.map(item => `${item.data} ${item.hora}:00`),
              y: sateliteData.map(item => item[metric]),
              type: 'scatter',
              mode: 'lines+markers',
              name: `${metric} - Satélite ${satelite}`,
              visible: index === 0 ? true : 'legendonly'
            };
          });
        });

        setData(plots);
        setShowLegends(Array(plots.length).fill(false)); // Inicializa a legenda para cada gráfico como fechada
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching the data: ", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params]);

  const handleGenerate = (newParams) => {
    setParams(newParams);
  };

  const toggleLegend = (index) => {
    setShowLegends(prevState => 
      prevState.map((show, i) => (i === index ? !show : show))
    );
  };

  return (
    <div className="dashboard-container">
      <MenuDashboard onGenerate={handleGenerate} />
      <LoadingWrapper isLoading={isLoading}>
        <div className="dashboard">
          {data.map((plotData, index) => (
            <div key={index} className="graph-container">
              <Plot
                data={plotData}
                layout={{
                  title: `Gráfico de ${['I', 'Fp', 'ROTI', 'g'][index]}`,
                  xaxis: { 
                    title: 'Data e Hora', 
                    titlefont: { size: 14 },
                    automargin: true
                  },
                  yaxis: { 
                    title: ['I', 'Fp', 'ROTI', 'g'][index], 
                    titlefont: { size: 14 },
                    automargin: true,
                    position: 20
                  },
                  width: plotDimensions.width,
                  height: plotDimensions.height,
                  margin: {
                    l: 50,
                    r: 50,
                    t: 50,
                    b: 250, 
                  },
                  showlegend: showLegends[index],
                  legend: {
                    orientation: 'h',
                    y: -0.3,
                    x: 0.5,
                    xanchor: 'center',
                    yanchor: 'top',
                    traceorder: 'normal',
                    title: {
                      text: 'Satélites',
                      font: { size: 14 }
                    },
                    font: { size: 12 },
                    tracegroupgap: 5
                  }
                }}
              />

              <button onClick={() => toggleLegend(index)} className="bg-gray-200 py-2 px-4 mt-2">
                {showLegends[index] ? 'Esconder Satélites' : 'Mostrar Satélites'}
              </button>
            </div>
          ))}
        </div>
      </LoadingWrapper>
    </div>
  );
};

export default GeradorDashboard;
