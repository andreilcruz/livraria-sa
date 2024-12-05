"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type PropostaI = {
  id: number;
  livro: {
    capa: string;
    titulo: string;
    autor: string;
  };
  cliente: {
    nome: string;
  };
  mensagem: string | null; // Proposta do cliente
  resposta: string | null;
};

export default function Propostas() {
  const [propostas, setPropostas] = useState<PropostaI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [responderId, setResponderId] = useState<number | null>(null); // ID da proposta que está sendo respondida
  const [respostaTexto, setRespostaTexto] = useState<string>("");

  useEffect(() => {
    async function fetchPropostas() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas`);
        if (!response.ok) {
          throw new Error("Erro ao carregar as propostas");
        }
        const data = await response.json();
        setPropostas(data);
      } catch (error) {
        toast.error("Erro ao carregar as propostas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchPropostas();
  }, []);

  const handleResponder = (id: number) => {
    setResponderId(id);
    setRespostaTexto(""); // Limpa o campo de resposta
  };

  const enviarResposta = async () => {
    if (!responderId || respostaTexto.trim() === "") {
      toast.error("A resposta não pode estar vazia.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas/${responderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resposta: respostaTexto }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar a resposta.");
      }

      // Atualiza a lista de propostas
      const updatedPropostas = propostas.map((proposta) =>
        proposta.id === responderId ? { ...proposta, resposta: respostaTexto } : proposta
      );
      setPropostas(updatedPropostas);

      toast.success("Resposta enviada com sucesso!");
      setResponderId(null); // Fecha o modal
    } catch (error) {
      toast.error("Erro ao enviar a resposta. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="container mt-8 mx-auto">
      <h1 className="text-3xl font-bold mb-4">Propostas</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Capa do Livro</th>
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Autor</th>
                <th className="px-6 py-3">Proposta do Cliente</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Resposta</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {propostas.length > 0 ? (
                propostas.map((proposta) => (
                  <tr
                    key={proposta.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={proposta.livro.capa}
                        alt="Capa do livro"
                        className="w-10 h-14 object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {proposta.livro.titulo}
                    </td>
                    <td className="px-6 py-4">{proposta.livro.autor}</td>
                    <td className="px-6 py-4">
                      {proposta.mensagem ? proposta.mensagem : "Sem proposta"}
                    </td>
                    <td className="px-6 py-4">{proposta.cliente.nome}</td>
                    <td className="px-6 py-4">
                      {proposta.resposta ? proposta.resposta : "Sem resposta"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleResponder(proposta.id)}
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487c-.637-.637-1.67-.637-2.308 0l-9.89 9.89a1.5 1.5 0 00-.394.683l-.911 4.776a.75.75 0 00.911.911l4.776-.911a1.5 1.5 0 00.683-.394l9.89-9.89c.637-.637.637-1.67 0-2.308l-2.457-2.457z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25V19.5a2.25 2.25 0 01-2.25 2.25H4.5"
                          />
                        </svg>
                        Responder
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Nenhuma proposta disponível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal embutido */}
      {responderId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Responder à Proposta {responderId}
            </h2>
            <textarea
              value={respostaTexto}
              onChange={(e) => setRespostaTexto(e.target.value)}
              rows={4}
              className="w-full p-2 border rounded mb-4"
              placeholder="Digite sua resposta..."
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setResponderId(null)}
                className="p-2 text-gray-600 hover:text-gray-800 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={enviarResposta}
                className="p-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Enviar Resposta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
