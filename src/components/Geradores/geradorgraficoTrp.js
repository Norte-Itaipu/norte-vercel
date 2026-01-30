import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Menu from '../menu/menuGraficoTrp';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const metricLabels = {
  pressao: 'Pressão',
  temperatura: 'Temperatura',
  umidade: 'Umidade',
  ZTD: 'ZTD (Zenith Total Delay)',
  ZTH: 'ZTH (Zenith Tropospheric Height)',
  ZTW: 'ZTW (Zenith Total Water Vapor)',
  IWV: 'IWV (Integrated Water Vapor)',
  PWV: 'PWV (Precipitable Water Vapor)',
};

const GeradorGraficoTrp = () => {
  const [data, setData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [params, setParams] = useState({
    startDate: '',
    endDate: '',
    xAxis: 'hora',
    yAxis: ['IWV'],
    station: 'guai',
  });

  useEffect(() => {
    const fetchData = async () => {
      const { startDate, endDate, xAxis, yAxis, station } = params;
      if (!startDate || !endDate || yAxis.length === 0) return;

      const start = new Date(startDate);
      const end = new Date(endDate);
      const urls = [];
      const baseUrl = process.env.NEXT_PUBLIC_TRP_API;

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const year = d.getFullYear();
        const startOfYear = new Date(year, 0, 0);
        const diff = (d - startOfYear) + ((startOfYear.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
        const doy = Math.floor(diff / (1000 * 60 * 60 * 24));
        urls.push(`${baseUrl}&ano=${year}&estacao=${station}&tipo_coleta=trp&doy=${String(doy).padStart(3, '0')}`);
      }

      try {
        const responses = await Promise.all(urls.map(url => axios.get(url)));
        const combinedData = responses.flatMap(res => res.data.content || []);

        const traces = yAxis.map((yMetric, index) => ({
          x: combinedData.map(item => {
            const horaDecimal = item.hora;
            const hours = Math.floor(horaDecimal);
            const minutes = Math.round((horaDecimal % 1) * 60);
            const h = String(hours).padStart(2, '0');
            const m = String(minutes).padStart(2, '0');
            return `${item.data}T${h}:${m}:00`;
          }),
          y: combinedData.map(item => item[yMetric]),
          type: 'scatter',
          mode: 'lines+markers',
          name: metricLabels[yMetric] || yMetric,
          yaxis: index === 0 ? 'y1' : 'y2',
        }));

        setData(traces);
        setDownloadData(combinedData);
      } catch (err) {
        console.error('Erro ao buscar dados troposféricos:', err);
        setData([]);
        setDownloadData([]);
      }
    };

    fetchData();
  }, [params]);

  const handleGenerate = (newParams) => {
    setParams(newParams);
  };

  const handleDownload = async () => {
    if (downloadData.length === 0) {
      alert('Nenhum dado disponível para download.');
      return;
    }

    const zip = new JSZip();

    const grouped = downloadData.reduce((acc, item) => {
      const { data } = item;
      if (!acc[data]) acc[data] = [];
      acc[data].push(item);
      return acc;
    }, {});

    for (const [date, entries] of Object.entries(grouped)) {
      const json = JSON.stringify(entries, null, 2);
      zip.file(`${params.station}_${date}.json`, json);
    }

    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'dados_trp.zip');
    } catch (err) {
      console.error('Erro ao gerar o arquivo zip:', err);
      alert('Erro ao tentar baixar os dados.');
    }
  };

  const isOneDay = params.startDate === params.endDate;

  return (
    <div>
      <Menu onGenerate={handleGenerate} />

      <Plot
        data={data}
        layout={{
          title: 'Gráfico de Métricas Troposféricas',
          xaxis: {
            title: 'Data e Hora',
            tickformat: isOneDay ? '%H:%M' : '%H:%M<br>%b %d, %Y',
            type: 'date',
            tickangle: -45,
          },
          yaxis: {
            title: metricLabels[params.yAxis[0]] || '',
          },
          yaxis2: {
            title: metricLabels[params.yAxis[1]] || '',
            overlaying: 'y',
            side: 'right',
            showgrid: false,
          },
          width: window.innerWidth < 768 ? window.innerWidth - 20 : 1050,
          height: 550,
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

export default GeradorGraficoTrp;
