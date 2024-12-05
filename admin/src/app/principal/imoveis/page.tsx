'use client';
import { useEffect, useState } from "react";
import Link from 'next/link';

import { toast } from 'sonner';

type Livro = {
  id: number;
  titulo: string;
  autor: string;
  paginas: number;
  preco: string;
  capa: string;
  genero: {
    nome: string;
  };
};

function CadastroLivros() {
  const [livros, setLivros] = useState<Livro[]>([]);

  useEffect(() => {
    async function fetchLivros() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/livros`);
        if (!response.ok) {
          throw new Error("Erro ao buscar livros");
        }
        const dados = await response.json();
        setLivros(dados);
      } catch (error) {
        toast.error("Erro ao carregar livros. Tente novamente mais tarde.");
        console.error("Erro ao buscar livros:", error);
      }
    }
    fetchLivros();
  }, []);

  const excluirLivro = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/livros/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Livro excluído com sucesso!");
        setLivros((prevLivros) => prevLivros.filter((livro) => livro.id !== id));
      } else {
        toast.error("Erro ao excluir o livro.");
      }
    } catch (error) {
      toast.error("Erro ao excluir o livro. Tente novamente mais tarde.");
      console.error("Erro ao excluir livro:", error);
    }
  };

  return (
    <div className='m-4 mt-24'>
      <div className='flex justify-between'>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          Cadastro de Livros
        </h1>
        <Link href="livros/novo" 
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          Novo Livro
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Capa
              </th>
              <th scope="col" className="px-6 py-3">
                Título
              </th>
              <th scope="col" className="px-6 py-3">
                Autor
              </th>
              <th scope="col" className="px-6 py-3">
                Gênero
              </th>
              <th scope="col" className="px-6 py-3">
                Páginas
              </th>
              <th scope="col" className="px-6 py-3">
                Preço R$
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {livros.length > 0 ? (
              livros.map((livro) => (
                <tr
                  key={livro.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">
                    <img src={livro.capa} alt="Capa do Livro" className="h-12 w-auto rounded" />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {livro.titulo}
                  </td>
                  <td className="px-6 py-4">{livro.autor}</td>
                  <td className="px-6 py-4">{livro.genero?.nome || "Sem gênero"}</td>
                  <td className="px-6 py-4">{livro.paginas}</td>
                  <td className="px-6 py-4">R$ {parseFloat(livro.preco).toFixed(2)}</td>
                  <td className="px-6 py-4">
  <button
    onClick={() => excluirLivro(livro.id)}
    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition duration-300"
  >
    Excluir
  </button>
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Nenhum livro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CadastroLivros;
