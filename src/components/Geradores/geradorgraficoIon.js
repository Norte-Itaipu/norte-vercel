import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Menu from '../menu/menuGraficoIon';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import colors from '@/util/colors';

const GeradorGraficoIon = () => {
  const [data, setData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDate, setErrorDate] = useState('');
  const [params, setParams] = useState({
    startDate: '',
    endDate: '',
    xAxis: 'Data',
    yAxis: ['I'],
    station: 'ITAI',
    elevacaoInicial: 0,
    elevacaoFinal: 90
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { startDate, endDate, xAxis, yAxis, station, elevacaoInicial, elevacaoFinal } = params;

        if (!startDate || !endDate || yAxis.length === 0) return;

        const cacheKey = `ion_data:${station}:${startDate}:${endDate}:${elevacaoInicial}:${elevacaoFinal}:${yAxis.join(',')}`;

        // try {
        //   const cacheResponse = await axios.get(`/api/cache/ionData?key=${encodeURIComponent(cacheKey)}`);
        //   if (cacheResponse.data.data) {
        //     setData(cacheResponse.data.data.plots);
        //     setDownloadData(cacheResponse.data.data.downloadData);
        //     return;
        //   }
        // } catch (error) {
        //   console.error('Error fetching cached data:', error);
        // }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const ionUrls = [];
        const gtsUrls = [];

        const ION_API = process.env.NEXT_PUBLIC_ION_API;

        start.setDate(start.getDate() + 1);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const year = d.getFullYear();
          const startOfYear = new Date(year, 0, 0);
          const diff = (d - startOfYear) + ((startOfYear.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
          const doy = Math.floor(diff / (1000 * 60 * 60 * 24));
          const formattedDate = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

          ionUrls.push(`${ION_API}&ano=${year}&estacao=${station}&tipo_coleta=ion&doy=${String(doy).padStart(3, '0')}`);
          gtsUrls.push(`${ION_API}&ano=${year}&estacao=${station}&tipo_coleta=gts&doy=${String(doy).padStart(3, '0')}`);

          try {
            const fetchIonData = await axios.get(ionUrls[ionUrls.length - 1]);
            const fetchGtsData = await axios.get(gtsUrls[gtsUrls.length - 1]);

            const ionData = (fetchIonData.data.content || []).map(item => ({ ...item, tipo_coleta: 'ion' }));
            const gtsData = (fetchGtsData.data.content || []).map(item => ({ ...item, tipo_coleta: 'gts' }));

            if (ionData.length === 0 && gtsData.length === 0) {
              throw new Error('Data não encontrada');
            }
          } catch (error) {
            if (error.response && error.response.status === 404) {
              setErrorMessage(`Data não possui dados relacionados para o dia ${formattedDate}`);
              setErrorDate(formattedDate);
              throw new Error(`Erro ao buscar dados para o dia ${formattedDate}`);
            }
          }
        }

        const fetchIonData = await Promise.all(ionUrls.map(url => axios.get(url)));
        const allIonData = fetchIonData.flatMap(response => (response.data.content || []).map(item => ({ ...item, tipo_coleta: 'ion' })));

        const fetchGtsData = await Promise.all(gtsUrls.map(url => axios.get(url)));
        const allGtsData = fetchGtsData.flatMap(response => (response.data.content || []).map(item => ({ ...item, tipo_coleta: 'gts' })));

        let combinedData = [...allIonData, ...allGtsData];

        combinedData = combinedData.filter(item => {
          const elevacao = parseFloat(item.elevacao);
          return elevacao >= elevacaoInicial && elevacao <= elevacaoFinal;
        });

        if (combinedData.length === 0) {
          setErrorMessage('Nenhum dado encontrado no intervalo de elevação especificado');
        } else {
          setErrorMessage('');
        }

        setDownloadData(combinedData);

        const satelites = [...new Set(combinedData.map(item => item.satelite))];
        const gSatelites = satelites.filter(sat => sat.startsWith("G")).sort();
        const rSatelites = satelites.filter(sat => sat.startsWith("R")).sort();
        const allSats = [...gSatelites, ...rSatelites];

        const plots = [];

        params.yAxis.forEach((variavel) => {
          allSats.forEach((satelite, index) => {
            const sateliteData = combinedData.filter(item => item.satelite === satelite);
            plots.push({
              x: params.xAxis === 'Data'
                ? sateliteData.map(item => `${item.data} ${item.hora}:00`)
                : sateliteData.map(item => item[params.xAxis]),
              y: sateliteData.map(item => item[variavel]),
              type: 'scatter',
              mode: 'lines+markers',
              name: `${satelite} - ${variavel}`,
              //visible: index === 0 ? true : 'legendonly',
            });
          });
        });

        // Salvar no cache através da API
        try {
          await axios.post('/api/cache/ionData', {
            key: cacheKey,
            data: {
              plots,
              downloadData: combinedData
            },
            ttl: 3600 // Cache por 1 hora
          });
        } catch (error) {
          console.error('Error saving to cache:', error);
        }

        setData(plots);
        setDownloadData(combinedData);

      } catch (error) {
        console.error("Error fetching the data: ", error);
      }
    };

    fetchData();
  }, [params]);

  const handleGenerate = (newParams) => {
    setParams(newParams);
  };

  const handleCloseError = () => {
    setErrorMessage('');
    setErrorDate('');
  };

  const handleDownload = async () => {
    if (downloadData.length === 0) {
      alert('Nenhum dado disponível para download.');
      return;
    }

    const zip = new JSZip();

    const groupedData = downloadData.reduce((acc, item) => {
      const { data, tipo_coleta } = item;
      if (!acc[data]) {
        acc[data] = {};
      }
      if (!acc[data][tipo_coleta]) {
        acc[data][tipo_coleta] = [];
      }
      acc[data][tipo_coleta].push(item);
      return acc;
    }, {});

    for (const [date, tipoColetaData] of Object.entries(groupedData)) {
      for (const [tipoColeta, dataItems] of Object.entries(tipoColetaData)) {
        const jsonData = JSON.stringify(dataItems, null, 2);
        zip.file(`${params.station}_${date}_${tipoColeta}.json`, jsonData);
      }
    }

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'dados_grafico.zip');
    } catch (error) {
      console.error('Erro ao gerar o arquivo zip:', error);
      alert('Ocorreu um erro ao tentar baixar os dados.');
    }
  };

  const getResponsiveWidth = () => {
    return window.innerWidth < 768 ? window.innerWidth - 20 : 1050;
  };

  return (
    <div>
      <Menu onGenerate={handleGenerate} />

      {errorMessage && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-md">
          <div className="flex justify-between items-center">
            <span>{errorMessage}</span>
            <button onClick={handleCloseError} className="bg-white text-red-500 px-3 py-1 rounded-md">Fechar</button>
          </div>
        </div>
      )}

      <Plot
        data={data}
        layout={{
          title: 'Gráfico de Métricas por Satélite',
          xaxis: {
            title: {
              text: params.xAxis === 'Data' ? 'Data e Hora' : params.xAxis,
              standoff: 0,
            },
            automargin: true,
          },
          yaxis: {
            title: params.yAxis.join(' / '),
          },
          margin: {
            t: 70,
            b: 250,
            l: 50,
            r: 50,
          },
          width: getResponsiveWidth(),
          height: 550,
          legend: {
            orientation: 'h',
            y: -0.3,
            x: 0.5,
            xanchor: 'center',
            yanchor: 'top',
            traceorder: 'normal',
            title: {
              text: 'Satélites',
              font: {
                size: 14,
              },
            },
            font: {
              size: 12,
            },
            tracegroupgap: 5,
          },
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          scrollZoom: true,
        }}
      />

      <div className="flex justify-center mt-4">
        <button
          onClick={handleDownload}
          className={`text-white py-2 px-4 rounded-lg shadow-lg transition-colors ${downloadData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ backgroundColor: '#61a299' }}
          disabled={downloadData.length === 0}
        >
          Baixar Dados
        </button>
      </div>
    </div>
  );
};

export default GeradorGraficoIon;
