'use client';

import { useEffect, useState } from 'react';
import { ClienteI } from '@/utils/types/clientes';

export default function ListagemClientes() {
  const [clientes, setClientes] = useState<ClienteI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClientes() {
      try {
        setLoading(true); // Inicia o carregamento
        setErrorMessage(null); // Limpa mensagem de erro

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes`);
        if (!response.ok) {
          throw new Error('Erro ao buscar clientes.');
        }

        const dados = await response.json();
        setClientes(dados);
      } catch (error: any) {
        setErrorMessage(error.message || 'Erro desconhecido ao buscar clientes.');
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    }

    fetchClientes();
  }, []);

  return (
    <section className="max-w-screen-xl mx-auto mt-24">
      {/* Ajuste no título */}
      <h1 className="mb-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
        Listagem de <span className="underline underline-offset-3 decoration-8 decoration-orange-400">Clientes</span>
      </h1>

      {/* Mensagens de erro e carregamento */}
      {loading && <p className="text-center">Carregando clientes...</p>}
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      {/* Tabela de Clientes */}
      {!loading && clientes.length > 0 ? (
        <table className="w-full text-sm text-left text-gray-500 border border-gray-700 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-800 text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome do Cliente
              </th>
              <th scope="col" className="px-6 py-3">
                E-mail
              </th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id} className="bg-gray-900 border-b border-gray-700">
                <td className="px-6 py-4 font-medium text-white">
                  {cliente.nome}
                </td>
                <td className="px-6 py-4 text-white">
                  {cliente.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-center">Nenhum cliente encontrado.</p>
      )}
    </section>
  );
}
