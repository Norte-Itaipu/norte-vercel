import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Menu from '../menu/menuPredict';

const API_PREDICT = process.env.NEXT_PUBLIC_PREDICT_API;
const API_REAL = process.env.NEXT_PUBLIC_ION_API;

function getDayOfYear(date) {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start + (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// busca dados reais (ROTI)
async function fetchRealDay(station, date) {
  try {
    const year = date.getFullYear();
    const doy = String(getDayOfYear(date)).padStart(3, '0');
    const url = `${API_REAL}&ano=${year}&estacao=${station}&tipo_coleta=ion&doy=${doy}`;
    const res = await axios.get(url);
    return Array.isArray(res.data?.content) ? res.data.content : [];
  } catch {
    return [];
  }
}

// busca conteúdo de um arquivo de previsão (ano/mes/dia/estacao)
async function fetchPredictDay(ano, mes, dia, estacao) {
  const url = `${API_PREDICT}?ano=${ano}&mes=${mes}&dia=${dia}&estacao=${estacao}`;
  const res = await axios.get(url);
  return res.data;
}

async function fetchLastPredictFiles(station) {
  try {
    const res = await axios.get(`${API_PREDICT}?list=true`);
    const data = res.data;

    // Caso o retorno seja no formato novo (com .stations)
    if (data && Array.isArray(data.stations)) {
      const stationData = data.stations.find(
        (s) => s.estacao?.toUpperCase() === station.toUpperCase()
      );

      if (!stationData) return [];

      // Extrai a data mais recente
      const { latest_date } = stationData;
      if (!latest_date) return [];

      // Quebra a data em partes (YYYY-MM-DD → ano/mes/dia)
      const [ano, mes, dia] = latest_date.split("-");

      // Simula até 3 arquivos — aqui vamos retornar só o mais recente,
      // pois a API não dá os três últimos dias, apenas o último.
      return [{ ano, mes, dia, path: `${ano}/${mes}/${dia}/${station}` }];
    }

    // Formato antigo (lista de arquivos)
    const all = Array.isArray(data) ? data : data?.files || [];
    const filtered = all.filter((f) =>
      f.toUpperCase().includes(`/${station.toUpperCase()}/`)
    );

    const parsed = filtered
      .map((f) => {
        let m = f.match(/(\d{4})\/(\d{2})\/(\d{2})/);
        if (m) return { ano: m[1], mes: m[2], dia: m[3], path: f };
        m = f.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (m) return { ano: m[1], mes: m[2], dia: m[3], path: f };
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => new Date(`${b.ano}-${b.mes}-${b.dia}`) - new Date(`${a.ano}-${a.mes}-${a.dia}`));

    return parsed.slice(0, 3);
  } catch (e) {
    console.error("Erro ao buscar arquivos de predição:", e);
    return [];
  }
}


const GeradorPredict = () => {
  const [station, setStation] = useState('ITAI');
  const [series, setSeries] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: '', info: '' });
  const [hasFetched, setHasFetched] = useState(false);

  const layout = useMemo(
    () => ({
      title: hasFetched
        ? `ROTI — Previsão (últimos 3 dias) ${station}`
        : 'Previsão ROTI',
      xaxis: { title: 'Tempo' },
      yaxis: { title: 'ROTI' },
      margin: { t: 40, r: 20, b: 150, l: 50 },
      legend: {
        orientation: 'h',
        y: -0.4,
        x: 0.5,
        xanchor: 'center',
        yanchor: 'top',
      },
    }),
    [station, hasFetched]
  );

  const loadLatest = async (st) => {
    setStatus({
      loading: true,
      error: '',
      info: 'Buscando últimos 3 dias de predição...',
    });
    setSeries([]);
    setHasFetched(true);

    try {
      const latestFiles = await fetchLastPredictFiles(st);

      if (latestFiles.length === 0) {
        setStatus({
          loading: false,
          error: 'Nenhum arquivo de predição encontrado.',
          info: '',
        });
        return;
      }

      let traces = [];

      for (const file of latestFiles) {
        const { ano, mes, dia } = file;

        // busca previsão
        const predictData = await fetchPredictDay(ano, mes, dia, st);
        const contentPred = Array.isArray(predictData?.content)
          ? predictData.content
          : [];

        const xPred = contentPred.map((row) => new Date(row.timestamp));
        const yPred = contentPred.map((row) => Number(row.ROTI_previsto ?? 0));

        // adiciona série de previsão
        traces.push({
          x: xPred,
          y: yPred,
          type: 'scatter',
          mode: 'lines+markers',
          name: `Previsão ${ano}-${mes}-${dia}`,
          line: { color: 'blue' },
        });

        // busca reais (não obrigatório)
        const dateObj = new Date(`${ano}-${mes}-${dia}`);
        const realData = await fetchRealDay(st, dateObj);

        if (realData.length > 0) {
          const bySat = realData.reduce((acc, row) => {
            const sat = row.satelite || 'SAT';
            if (!acc[sat]) acc[sat] = [];
            acc[sat].push(row);
            return acc;
          }, {});

          Object.entries(bySat).forEach(([sat, rows]) => {
            rows.sort((a, b) => Number(a.hora ?? 0) - Number(b.hora ?? 0));
            traces.push({
              x: rows.map(
                (r) =>
                  new Date(`${r.data}T${String(r.hora).padStart(2, '0')}:00:00`)
              ),
              y: rows.map((r) => Number(r.ROTI ?? 0)),
              type: 'scatter',
              mode: 'lines',
              name: `${sat} - ROTI Real`,
              line: { color: 'green', width: 1 },
            });
          });
        }
      }

      setSeries(traces);
      setStatus({
        loading: false,
        error: '',
        info: `Carregado com sucesso (${latestFiles.length} dia(s) encontrados).`,
      });
    } catch (e) {
      setStatus({
        loading: false,
        error: e?.message || 'Erro ao buscar dados de predição.',
        info: '',
      });
    }
  };

  return (
    <div>
      <Menu onGenerate={loadLatest} station={station} onChangeStation={setStation} />

      {status.loading && (
        <div
          style={{
            padding: 8,
            background: '#eef',
            border: '1px solid #99f',
            marginBottom: 12,
          }}
        >
          {status.info}
        </div>
      )}

      {status.error && (
        <div
          style={{
            padding: 8,
            background: '#fee',
            border: '1px solid #f99',
            marginBottom: 12,
          }}
        >
          {status.error}
        </div>
      )}

      {hasFetched && !status.loading && series.length > 0 && (
        <Plot
          data={series}
          layout={layout}
          style={{ width: '100%', height: '500px' }}
          useResizeHandler
        />
      )}

      {hasFetched && !status.loading && !status.error && series.length === 0 && (
        <div style={{ opacity: 0.7 }}>Nenhum dado para exibir.</div>
      )}
    </div>
  );
};

export default GeradorPredict;
