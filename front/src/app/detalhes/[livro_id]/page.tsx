"use client";
import { usePathname } from "next/navigation"; // Use para capturar parâmetros diretamente
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/cliente";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type LivroDetalhes = {
  id: number;
  titulo: string;
  autor: string;
  preco: number;
  paginas: number;
  capa: string;
  sinopse: string;
  genero: { nome: string } | null;
};

type PropostaInputs = {
  mensagem: string;
};

export default function DetalhesLivro() {
  const pathname = usePathname(); // Captura o caminho completo da URL
  const livro_id = pathname.split("/")[2]; // Extrai o ID do livro da URL
  const { cliente } = useClienteStore();
  const [livro, setLivro] = useState<LivroDetalhes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { register, handleSubmit, reset } = useForm<PropostaInputs>();

  useEffect(() => {
    async function buscaDadosLivro() {
      if (!livro_id) {
        console.error("ID do livro não está definido.");
        toast.error("ID do livro não encontrado.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/livros/${livro_id}`
        );

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }

        const dados = await response.json();
        setLivro(dados);
      } catch (error) {
        console.error("Erro ao buscar dados do livro:", error);
        toast.error("Erro ao carregar os detalhes do livro.");
      } finally {
        setLoading(false);
      }
    }

    buscaDadosLivro();
  }, [livro_id]);

  async function enviaProposta(data: PropostaInputs) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/propostas`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Token no cabeçalho
          },
          method: "POST",
          body: JSON.stringify({
            clienteId: cliente.id,
            livroId: Number(livro_id),
            mensagem: data.mensagem,
          }),
        }
      );

      if (response.status === 201) {
        toast.success("Proposta enviada com sucesso!");
        reset(); // Limpa o formulário
      } else if (response.status === 401) {
        toast.error("Sua sessão expirou. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redireciona para login
      } else {
        toast.error("Erro ao enviar proposta.");
      }
    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
      toast.error("Erro ao enviar proposta.");
    }
  }

  if (loading) {
    return <div className="text-center">Carregando detalhes do livro...</div>;
  }

  if (!livro) {
    return <div className="text-center">Livro não encontrado.</div>;
  }

  return (
    <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <img
        className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
        src={livro.capa || "/default-image.jpg"}
        alt={`Capa do livro ${livro.titulo}`}
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {livro.titulo}
        </h5>
        <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
          Autor: {livro.autor}
        </h5>
        <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
          Gênero: {livro.genero?.nome || "Gênero não disponível"}
        </h5>
        <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
          Preço R$:{" "}
          {livro.preco.toLocaleString("pt-br", { minimumFractionDigits: 2 })}
        </h5>
        <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
          Páginas: {livro.paginas}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {livro.sinopse}
        </p>

        {cliente.id ? (
          <>
            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Gostou deste livro? Envie uma proposta!
            </h3>
            <form onSubmit={handleSubmit(enviaProposta)}>
              <input
                type="text"
                className="mb-2 mt-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={`${cliente.nome} (${cliente.email})`}
                disabled
                readOnly
              />
              <textarea
                id="mensagem"
                className="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring
-blue-500 dark:focus:border-blue-500" placeholder="Descreva sua proposta" required {...register("mensagem")} ></textarea> <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" > Enviar Proposta </button> </form> </> ) : ( <h3 className="text-xl font-bold tracking-tight text-orange-700 dark:text-white"> ** Faça login para enviar uma proposta. </h3> )} </div> </section> ); }