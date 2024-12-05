'use client';

import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

export default function Principal() {
  const [clientesCount, setClientesCount] = useState<number>(0);
  const [livrosCount, setLivrosCount] = useState<number>(0);
  const [propostasCount, setPropostasCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        setLoading(true);
        setErrorMessage(null);

        // Buscar número de clientes
        const clientesResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes`);
        if (!clientesResponse.ok) {
          throw new Error('Erro ao buscar clientes.');
        }
        const clientesData = await clientesResponse.json();
        setClientesCount(clientesData.length);

        // Buscar número de livros
        const livrosResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/livros`);
        if (!livrosResponse.ok) {
          throw new Error('Erro ao buscar livros.');
        }
        const livrosData = await livrosResponse.json();
        setLivrosCount(livrosData.length);

        // Buscar número de propostas
        const propostasResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas`);
        if (!propostasResponse.ok) {
          throw new Error('Erro ao buscar propostas.');
        }
        const propostasData = await propostasResponse.json();
        setPropostasCount(propostasData.length);
      } catch (error: any) {
        setErrorMessage(error.message || 'Erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  // Configuração dos dados do gráfico
  const data = [
    ['Categoria', 'Quantidade', { role: 'style' }],
    ['Clientes', clientesCount, '#cce4f7'], // Azul claro
    ['Livros', livrosCount, '#f7cccc'], // Vermelho claro
    ['Propostas', propostasCount, '#d4f7cc'], // Verde claro
  ];

  const options = {
    title: 'Quantidade por Categoria',
    chartArea: { width: '70%' },
    hAxis: {
      title: 'Quantidade',
      minValue: 0,
    },
    vAxis: {
      title: 'Categorias',
    },
  };

  return (
    <div className="container mt-24">
      <h2 className="text-3xl mb-4 font-bold text-black">Visão Geral do Sistema</h2>

      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      {loading ? (
        <p className="text-center">Carregando dados...</p>
      ) : (
        <>
          <div className="w-2/3 flex justify-between mx-auto mb-5">
            <div className="border-blue-600 border rounded p-6 w-1/3 me-3">
              <span className="bg-blue-100 text-blue-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
                {clientesCount}
              </span>
              <p className="font-bold mt-2 text-center">Nº Clientes</p>
            </div>
            <div className="border-red-600 border rounded p-6 w-1/3 me-3">
              <span className="bg-red-100 text-red-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
                {livrosCount}
              </span>
              <p className="font-bold mt-2 text-center">Nº Livros</p>
            </div>
            <div className="border-green-600 border rounded p-6 w-1/3">
              <span className="bg-green-100 text-green-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
                {propostasCount}
              </span>
              <p className="font-bold mt-2 text-center">Nº Propostas</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-4 text-black">Gráfico: Quantidade por Categoria</h2>
          <Chart chartType="ColumnChart" width="100%" height="400px" data={data} options={options} />
        </>
      )}
    </div>
  );
}
