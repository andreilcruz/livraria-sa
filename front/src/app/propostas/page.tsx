"use client";

import { useEffect, useState } from "react";

interface PropostaI {
  id: number;
  livro: {
    titulo: string;
    autor: string;
  };
  mensagem: string; // Atualizado para refletir os dados da API
  resposta: string | null;
}

export default function MinhasPropostas() {
  const [propostas, setPropostas] = useState<PropostaI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPropostas() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas`);
        if (!response.ok) {
          throw new Error("Erro ao buscar propostas");
        }
        const data = await response.json();
        console.log("Dados recebidos da API:", data); // Debug para confirmar os dados
        setPropostas(data);
      } catch (error) {
        setErrorMessage("Erro ao carregar as propostas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchPropostas();
  }, []);

  return (
    <div className="container mt-8 mx-auto">
      <h1 className="text-3xl font-bold mb-4">Minhas Propostas</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Título do Livro
                </th>
                <th scope="col" className="px-6 py-3">
                  Autor
                </th>
                <th scope="col" className="px-6 py-3">
                  Proposta
                </th>
                <th scope="col" className="px-6 py-3">
                  Resposta
                </th>
              </tr>
            </thead>
            <tbody>
              {propostas.length > 0 ? (
                propostas.map((proposta) => (
                  <tr
                    key={proposta.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {proposta.livro?.titulo || "N/A"}
                    </td>
                    <td className="px-6 py-4">{proposta.livro?.autor || "N/A"}</td>
                    <td className="px-6 py-4">{proposta.mensagem || "Sem proposta"}</td> {/* Ajustado */}
                    <td className="px-6 py-4">{proposta.resposta || "Sem resposta"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma proposta disponível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
