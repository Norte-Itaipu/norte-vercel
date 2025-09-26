# NORTE-Itaipu - Plataforma de Monitoramento Atmosférico

Este projeto é uma plataforma web desenvolvida em [Next.js](https://nextjs.org/) para monitoramento e visualização de dados Ionosféricos, Troposféricos e Climáticos na região oeste do Paraná, resultado da parceria entre ITAIPU Binacional e UTFPR (Santa Helena).

## Funcionalidades

- Visualização de métricas e gráficos interativos de dados GNSS e meteorológicos das estações RBMC-MET (Foz do Iguaçu, Guaíra, Santa Helena).
- Dashboard customizável para análise de diferentes estações e períodos.
- Download dos dados visualizados em formato .zip.
- Interface responsiva e intuitiva.
- Navegação entre páginas de métricas, dashboard e informações do projeto.

## Estrutura do Projeto

- `src/pages/` – Páginas principais do site ([index.tsx](src/pages/index.tsx), [metrics.tsx](src/pages/metrics.tsx), [dashboard.tsx](src/pages/dashboard.tsx))
- `src/components/` – Componentes reutilizáveis (gráficos, menus, header, botões, etc)
- `src/styles/` – Estilos globais com Tailwind CSS
- `public/images/` – Imagens utilizadas na interface

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) (React, SSR/SSG)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Plotly.js](https://plotly.com/javascript/) e [react-plotly.js](https://github.com/plotly/react-plotly.js) para gráficos
- [Axios](https://axios-http.com/) para requisições HTTP
- [JSZip](https://stuk.github.io/jszip/) e [file-saver](https://github.com/eligrey/FileSaver.js/) para download de dados

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Configure as variáveis de ambiente em `.env.local` (veja exemplos de endpoints nas chamadas das APIs nos componentes).

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura de Diretórios

```
src/
  components/
  pages/
  styles/
  utils/
public/
  images/
```

## Sobre o Projeto

A plataforma NORTE-Itaipu visa integrar tecnologias espaciais e ambientais para monitorar e analisar fenômenos atmosféricos, fornecendo dados e análises para a comunidade científica, técnica e sociedade em geral. Mais detalhes podem ser encontrados na página inicial do projeto.

## Deploy

A aplicação pode ser facilmente implantada na [Vercel](https://vercel.com/) ou em qualquer serviço compatível com Next.js.

---

Para dúvidas ou contribuições, consulte o repositório ou entre em contato com os responsáveis