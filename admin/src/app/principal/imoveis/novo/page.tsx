"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Inputs = {
  generoId: string;
  titulo: string;
  autor: string;
  preco: string;
  paginas: string;
  capa: string;
  sinopse: string;
};

type Genero = {
  id: number;
  nome: string;
};

export default function NovoLivro() {
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>();
  const [generos, setGeneros] = useState<Genero[]>([]);

  useEffect(() => {
    async function fetchGeneros() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/generos`);
        if (!response.ok) {
          throw new Error("Erro ao carregar os gêneros");
        }
        const data = await response.json();
        setGeneros(data);
      } catch (error) {
        toast.error("Erro ao carregar os gêneros");
        console.error(error);
      }
    }

    fetchGeneros();
    setFocus("titulo");
  }, [setFocus]);

  async function incluirLivro(data: Inputs) {
    const livroData = {
      generoId: Number(data.generoId),
      titulo: data.titulo,
      autor: data.autor,
      preco: parseFloat(data.preco),
      paginas: parseInt(data.paginas, 10),
      capa: data.capa,
      sinopse: data.sinopse,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/livros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(livroData),
      });

      if (response.ok) {
        toast.success("Livro cadastrado com sucesso!");
        reset();
      } else {
        const error = await response.json();
        toast.error(error.message || "Erro ao cadastrar o livro.");
      }
    } catch (error) {
      toast.error("Erro na requisição. Verifique a conexão.");
      console.error("Erro ao enviar os dados:", error);
    }
  }

  return (
    <main className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Inclusão de Livros</h1>
      <form className="max-w-xl mx-auto" onSubmit={handleSubmit(incluirLivro)}>
        <div className="mb-4">
          <label htmlFor="titulo" className="block mb-2 text-sm font-medium text-black">
            Título do Livro
          </label>
          <input
            id="titulo"
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            {...register("titulo")}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="autor" className="block mb-2 text-sm font-medium text-black">
            Autor
          </label>
          <input
            id="autor"
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            {...register("autor")}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="generoId" className="block mb-2 text-sm font-medium text-black">
            Gênero
          </label>
          <select
            id="generoId"
            className="w-full p-2 border border-gray-300 rounded"
            {...register("generoId")}
            required
          >
            <option value="">Selecione um gênero</option>
            {generos.map((genero) => (
              <option key={genero.id} value={genero.id}>
                {genero.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="paginas" className="block mb-2 text-sm font-medium text-black">
              Número de Páginas
            </label>
            <input
              id="paginas"
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("paginas")}
              required
            />
          </div>
          <div>
            <label htmlFor="preco" className="block mb-2 text-sm font-medium text-black">
              Preço R$
            </label>
            <input
              id="preco"
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("preco")}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="capa" className="block mb-2 text-sm font-medium text-black">
            URL da Capa
          </label>
          <input
            id="capa"
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            {...register("capa")}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="sinopse" className="block mb-2 text-sm font-medium text-black">
            Sinopse
          </label>
          <textarea
            id="sinopse"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded"
            {...register("sinopse")}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Cadastrar Livro
        </button>
      </form>
    </main>
  );
}
