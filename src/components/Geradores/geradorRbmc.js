import React, { useState } from 'react';
import MenuRbmc from '../menu/menuRbmc';

function getDayOfYear(dateStr) {
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const GeradorRbmc = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleGenerate = async ({ date, station }) => {
    setError('');
    setStatus('');
    setUrl('');

    if (!date || !station) {
      setError('Selecione uma data e uma estação RBMC.');
      return;
    }

    const year = new Date(date).getFullYear();
    const doyNum = getDayOfYear(date);
    const doy3 = String(doyNum).padStart(3, '0');
    const sigla = station.toLowerCase();
    const baseUrl =
      'https://geoftp.ibge.gov.br/informacoes_sobre_posicionamento_geodesico/rbmc/dados';

    // arquivo direto (ex: prgu2841.zip)
    const finalUrl = `${baseUrl}/${year}/${doyNum}/${sigla}${doy3}1.zip`;

    try {
      setStatus('Verificando disponibilidade...');
      const head = await fetch(finalUrl, { method: 'HEAD' });

      if (head.ok) {
        setUrl(finalUrl);
        setStatus('Arquivo encontrado, iniciando download...');

        // força o download
        const a = document.createElement('a');
        a.href = finalUrl;
        a.download = `${sigla}${doy3}1.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => setStatus('Download iniciado!'), 1000);
      } else {
        setError('Arquivo não encontrado no servidor do IBGE para esta data.');
      }
    } catch (err) {
      console.error(err);
      setError('Falha ao acessar o servidor do IBGE.');
    }
  };

  return (
    <div>
      <MenuRbmc onGenerate={handleGenerate} />

      {error && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-md">
          {error}
        </div>
      )}

      {status && !error && (
        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-md">
          {status}
        </div>
      )}

      {url && !error && (
        <div className="bg-blue-100 text-blue-800 p-4 mb-4 rounded-md break-all">
          <strong>URL do arquivo:</strong> {url}
        </div>
      )}
    </div>
  );
};

export default GeradorRbmc;
