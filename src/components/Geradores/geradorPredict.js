import React, { useEffect, useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Menu from '../menuPredict';

const API_PREDICT = process.env.NEXT_PUBLIC_PREDICT_API;
const API_REAL = process.env.NEXT_PUBLIC_ION_API;

const pad2 = (n) => String(n).padStart(2, '0');

function fmt2(n) {
  return String(n).padStart(2, '0');
}

function doyUTC(date) {
  const y = date.getUTCFullYear();
  const start = Date.UTC(y, 0, 1);
  const day = Date.UTC(y, date.getUTCMonth(), date.getUTCDate());
  return Math.floor((day - start) / 86400000) + 1;
}

async function fetchPredictDay(station, date) {
  const url = `${API_PREDICT}?ano=${date.getFullYear()}&mes=${fmt2(
    date.getMonth() + 1
  )}&dia=${fmt2(date.getDate())}&estacao=${station}`;
  const res = await axios.get(url);
  return res.data;
}

async function fetchRealDay(station, date) {
  const y = date.getFullYear();
  const dUTC = new Date(Date.UTC(y, date.getMonth(), date.getDate()));
  const doy = doyUTC(dUTC);
  const url = `${API_REAL}&ano=${y}&estacao=${station}&tipo_coleta=ion&doy=${String(
    doy
  ).padStart(3, '0')}`;
  const res = await axios.get(url);
  return res.data;
}

function filterPredictTo48hFrom(date, content) {
  const d0 = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const d1 = new Date(d0);
  d1.setUTCDate(d0.getUTCDate() + 1);

  const d0Str = `${d0.getUTCFullYear()}-${fmt2(d0.getUTCMonth() + 1)}-${fmt2(d0.getUTCDate())}`;
  const d1Str = `${d1.getUTCFullYear()}-${fmt2(d1.getUTCMonth() + 1)}-${fmt2(d1.getUTCDate())}`;

  const hasDataHora = content.length && content[0].data !== undefined && content[0].hora !== undefined;

  if (hasDataHora) {
    return content
      .filter(r => r.data === d0Str || r.data === d1Str)
      .map(r => ({
        x: new Date(`${r.data}T${pad2(Number(r.hora ?? 0))}:00:00`),
        y: Number(r.ROTI_previsto ?? 0),
      }));
  } else {
    return content
      .map(r => {
        const dt = new Date(String(r.timestamp).replace(' ', 'T'));
        return { dt, y: Number(r.ROTI_previsto ?? 0) };
      })
      .filter(({ dt }) => dt >= d0 && dt < new Date(d1.getTime() + 24 * 3600 * 1000))
      .map(({ dt, y }) => ({ x: dt, y }));
  }
}

async function findLatestOverlapDate(station, maxDaysBack = 180) {
  const today = new Date();
  for (let i = 0; i < maxDaysBack; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    let predictPayload, realPayload;

    try {
      const p = await fetchPredictDay(station, d);
      const pContent = Array.isArray(p?.content) ? p.content : [];
      const p48 = filterPredictTo48hFrom(d, pContent);
      if (p48.length === 0) continue;
      predictPayload = { raw: p, filtered: p48 };
    } catch {
      continue;
    }

    try {
      const r = await fetchRealDay(station, d);
      const rContent = Array.isArray(r?.content) ? r.content : [];
      if (rContent.length === 0) continue;
      realPayload = rContent;
    } catch {
      continue;
    }

    if (predictPayload && realPayload) {
      return { date: d, predict: predictPayload, real: realPayload };
    }
  }
  throw new Error('Não encontrei um dia recente com dados de PREVISÃO (D/D+1) e REAIS (D).');
}

const GeradorPredict = () => {
  const [station, setStation] = useState('ITAI');
  const [series, setSeries] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: '', info: '' });
  const [lastDate, setLastDate] = useState(null);

  const layout = useMemo(
    () => ({
      title: lastDate
        ? `ROTI — Previsão vs Real — ${station} — ${lastDate.toISOString().slice(0, 10)}`
        : `ROTI — Previsão vs Real — ${station}`,
      xaxis: { title: 'Data' },
      yaxis: { title: 'ROTI' },
      margin: { t: 40, r: 20, b: 150, l: 50 }, // margem inferior maior
      legend: {
        orientation: 'h',
        y: -0.4,       // move para baixo do eixo X
        x: 0.5,
        xanchor: 'center',
        yanchor: 'top',
      },
    }),
    [station, lastDate]
  );

  const loadLatest = async (st) => {
    setStatus({ loading: true, error: '', info: 'Buscando último dia com dados de previsão e reais…' });
    setSeries([]);

    try {
      const { date, predict, real } = await findLatestOverlapDate(st);
      setLastDate(date);

      const xPred = predict.filtered.map(p => p.x);
      const yPred = predict.filtered.map(p => p.y);

      const traces = [
        {
          x: xPred,
          y: yPred,
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Previsão (ROTI_previsto)',
          line: { color: 'blue' },
        },
      ];

      const bySat = real.reduce((acc, row) => {
        const sat = row.satelite || 'SAT';
        if (!acc[sat]) acc[sat] = [];
        acc[sat].push(row);
        return acc;
      }, {});

      Object.entries(bySat).forEach(([sat, rows]) => {
        rows.sort((a, b) => Number(a.hora ?? 0) - Number(b.hora ?? 0));
        traces.push({
          x: rows.map(r => new Date(`${r.data}T${pad2(Number(r.hora ?? 0))}:00:00`)),
          y: rows.map(r => Number(r.ROTI ?? 0)),
          type: 'scatter',
          mode: 'lines+markers',
          name: `${sat} — ROTI`,
        });
      });

      setSeries(traces);
      setStatus({
        loading: false,
        error: '',
        info: `Dados de ${date.toISOString().slice(0, 10)} carregados.`,
      });
    } catch (e) {
      setStatus({ loading: false, error: e?.message || 'Falha ao buscar dados.', info: '' });
    }
  };

  useEffect(() => {
    loadLatest(station);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station]);

  return (
    <div>
      <Menu onChangeStation={setStation} currentStation={station} />

      {status.loading && (
        <div style={{ padding: 8, background: '#eef', border: '1px solid #99f', marginBottom: 12 }}>
          {status.info}
        </div>
      )}

      {status.error && (
        <div style={{ padding: 8, background: '#fee', border: '1px solid #f99', marginBottom: 12 }}>
          {status.error}
        </div>
      )}

      {!status.loading && series.length > 0 && (
        <Plot data={series} layout={layout} style={{ width: '100%', height: '500px' }} useResizeHandler />
      )}

      {!status.loading && !status.error && series.length === 0 && (
        <div style={{ opacity: 0.7 }}>Nenhum dado para exibir.</div>
      )}
    </div>
  );
};

export default GeradorPredict;
