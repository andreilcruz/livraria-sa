import { LivroI } from "@/utils/types/livros";
import Link from "next/link";

type Props = {
  data: LivroI;
};

export function ItemLivros({ data }: Props) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="w-full bg-gray-100 dark:bg-gray-700">
        <img
          className="w-full object-contain rounded-t-lg" // Garante que a imagem seja mostrada por completo
          src={data.capa || "/default-book-cover.jpg"}
          alt={`Capa do livro ${data.titulo}`}
        />
      </div>
      <div className="p-5">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {data.titulo}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Autor: {data.autor}
        </p>
        <p className="mb-3 font-bold text-gray-900 dark:text-white">
          Preço:{" "}
          {data.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <Link
          href={`/detalhes/${data.id}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}
