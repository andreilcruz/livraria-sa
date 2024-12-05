'use client'
import { Dispatch, SetStateAction } from "react"
import { TiDeleteOutline } from "react-icons/ti"
import { FaRegStar } from "react-icons/fa"
import Cookies from "js-cookie"
import { ImovelI } from "@/utils/types/imoveis"

interface listaImovelProps {
  imovel: ImovelI,
  imoveis: ImovelI[],
  setImoveis: Dispatch<SetStateAction<ImovelI[]>>
}

function ItemImovel({ imovel, imoveis, setImoveis }: listaImovelProps) {

  async function excluirImovel() {
    if (confirm(`Confirma a exclusão do imóvel?`)) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/${imovel.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
          },
        },
      )

      if (response.status === 200) {
        const imoveisAtualizados = imoveis.filter(x => x.id !== imovel.id)
        setImoveis(imoveisAtualizados)
        alert("Imóvel excluído com sucesso")
      } else {
        alert("Erro... Imóvel não foi excluído")
      }
    }
  }

  async function alterarDestaque() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imoveis/destacar/${imovel.id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
        },
      },
    )

    if (response.status === 200) {
      const imoveisAtualizados = imoveis.map(x => {
        if (x.id === imovel.id) {
          return { ...x, destaque: !x.destaque }
        }
        return x
      })
      setImoveis(imoveisAtualizados)
    }
  }

  return (
    <tr key={imovel.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={imovel.foto} alt="Imagem do Imóvel"
          style={{ width: 200 }} />
      </th>
      <td className={`px-6 py-4 ${imovel.destaque ? "font-extrabold" : ""}`}>
        {imovel.endereco}
      </td>
      <td className={`px-6 py-4 ${imovel.destaque ? "font-extrabold" : ""}`}>
  {imovel.tipo?.nome || "Tipo não definido"}
</td>
      <td className={`px-6 py-4 ${imovel.destaque ? "font-extrabold" : ""}`}>
        {Number(imovel.area).toLocaleString("pt-br")} m²
      </td>
      <td className={`px-6 py-4 ${imovel.destaque ? "font-extrabold" : ""}`}>
        R$ {Number(imovel.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
          onClick={excluirImovel} />&nbsp;
        <FaRegStar className="text-3xl text-yellow-600 inline-block cursor-pointer" title="Destacar"
          onClick={alterarDestaque} />
      </td>
    </tr>
  )
}

export default ItemImovel
