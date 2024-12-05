"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";

type Inputs = {
  email: string;
  senha: string;
};

export default function AdminLogin() {
  const { register, handleSubmit, setFocus } = useForm<Inputs>();
  const router = useRouter();

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  async function verificaLogin(data: Inputs) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/admins/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, senha: data.senha }),
      });

      if (response.ok) {
        const admin = await response.json();

        // Armazena os dados do administrador em cookies
        Cookies.set("admin_logado_id", admin.id, { path: "/" });
        Cookies.set("admin_logado_nome", admin.nome, { path: "/" });
        Cookies.set("admin_logado_token", admin.token, { path: "/" });

        toast.success(`Bem-vindo, ${admin.nome}!`);
        router.push("/principal");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao fazer login.");
      }
    } catch (err) {
      toast.error("Erro na requisição. Verifique a conexão.");
      console.error("Erro ao fazer login:", err);
    }
  }

  return (
    <main className="max-w-screen-xl flex flex-col items-center mx-auto p-6">
      <img src="./logoverde.jpg" alt="Imobiliária" style={{ width: 240 }} className="d-block" />
      <div className="max-w-sm">
        <h1 className="text-3xl font-bold my-8">Admin: Livraria SA</h1>
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit(verificaLogin)}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">
              E-mail:
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...register("email")}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...register("senha")}
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
