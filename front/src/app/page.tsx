'use client';

import { useEffect, useState } from "react";
import { InputPesquisa } from "@/components/InputPesquisa";
import { ItemLivros } from "@/components/ItemImoveis"; // Atualize para o componente correto
import { LivroI } from "@/utils/types/livros"; // Certifique-se de que esse tipo está criado
import { Toaster } from "sonner";
import { useClienteStore } from "@/context/cliente";

export default function Home() {
  const [livros, setLivros] = useState<LivroI[]>([]); // Alterado para `LivroI`
  const { logaCliente } = useClienteStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function buscaCliente(idCliente: string) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${idCliente}`);
        if (response.ok) {
          const dados = await response.json();
          logaCliente(dados);
        } else {
          console.error("Erro ao buscar dados do cliente:", response.status);
        }
      } catch (error) {
        console.error("Erro na requisição de cliente:", error);
      }
    }

    async function buscaDados() {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/livros`);
        if (response.ok) {
          const dados = await response.json();
          setLivros(dados);
        } else {
          setErrorMessage("Erro ao buscar livros.");
          console.error("Erro ao buscar livros:", response.status);
        }
      } catch (error) {
        setErrorMessage("Erro na requisição de livros.");
        console.error("Erro na requisição de livros:", error);
      } finally {
        setLoading(false);
      }
    }

    const idClienteLocal = localStorage.getItem("client_key");
    if (idClienteLocal) {
      buscaCliente(idClienteLocal);
    }

    buscaDados();
  }, [logaCliente]);

  const listaLivros = livros.map((livro) => (
    <ItemLivros data={livro} key={livro.id} />
  ));

  return (
    <main>
      <InputPesquisa setLivros={setLivros} /> {/* Ajuste o nome da prop */}

      <section className="max-w-screen-xl mx-auto">
        <h1 className="mb-5 mt-2 text-3xl font-extrabold leading-none tracking-tight text-black-900 md:text-4xl lg:text-5xl dark:text-black">
          Livros <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">em destaque</span>
        </h1>

        {loading && <p className="text-center">Carregando livros...</p>}
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {!loading && listaLivros.length > 0 ? listaLivros : !loading && <p className="text-center">Nenhum livro disponível no momento.</p>}
        </div>
      </section>

      <Toaster position="top-right" richColors />
    </main>
  );
}
