'use client'
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Titulo } from "../../components/Titulo";
import { MenuLateral } from "../../components/MenuLateral";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter()
  const [logado, setLogado] = useState<boolean>(false)

  useEffect(() => {
    // Verifica se o administrador está logado
    if (Cookies.get("admin_logado_id")) {
      setLogado(true)
    } else {
      router.replace("/") // Redireciona para o login se não estiver logado
    }
  }, [router])

  return (
    <>
      {logado && (
        <div>
          {/* Cabeçalho com o título */}
          <Titulo />
          {/* Menu lateral para navegação */}
          <MenuLateral />
          {/* Conteúdo principal */}
          <div className="p-4 sm:ml-64">
            {children}
          </div>
        </div>
      )}
    </>
  )
}
