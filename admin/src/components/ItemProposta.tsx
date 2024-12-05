'use client'
import { Dispatch, SetStateAction } from "react"
import { TiDeleteOutline } from "react-icons/ti"
import { FaRegEdit } from "react-icons/fa"
import Cookies from "js-cookie"
import { PropostaI } from "@/utils/types/propostas"

interface listaPropostaProps {
  proposta: PropostaI,
  propostas: PropostaI[],
  setPropostas: Dispatch<SetStateAction<PropostaI[]>>
}

function ItemProposta({ proposta, propostas, setPropostas }: listaPropostaProps) {

  async function excluirProposta() {
    if (confirm(`Confirma exclusão da proposta para "${proposta.imovel.endereco}"?`)) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas/${proposta.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
          },
        },
      )

      if (response.status === 200) {
        const propostasAtualizadas = propostas.filter(x => x.id !== proposta.id)
        setPropostas(propostasAtualizadas)
        alert("Proposta excluída com sucesso")
      } else {
        alert("Erro... Proposta não foi excluída")
      }
    }
  }

  async function responderProposta() {
    const respostaImobiliaria = prompt(`Resposta para a proposta do imóvel em "${proposta.imovel.endereco}"`)

    if (respostaImobiliaria == null || respostaImobiliaria.trim() === "") {
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas/${proposta.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
        },
        body: JSON.stringify({ resposta: respostaImobiliaria })
      },
    )

    if (response.status === 200) {
      const propostasAtualizadas = propostas.map(x => {
        if (x.id === proposta.id) {
          return { ...x, resposta: respostaImobiliaria }
        }
        return x
      })
      setPropostas(propostasAtualizadas)
    }
  }

  return (
    <tr key={proposta.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={proposta.imovel.foto} alt="Foto do Imóvel"
          style={{ width: 200 }} />
      </th>
      <td className="px-6 py-4">
        {proposta.imovel.endereco}
      </td>
      <td className="px-6 py-4">
        R$ {Number(proposta.imovel.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4">
        {proposta.cliente.nome}
      </td>
      <td className="px-6 py-4">
        {proposta.descricao}
      </td>
      <td className="px-6 py-4">
        {proposta.resposta}
      </td>
      <td className="px-6 py-4">
        {proposta.resposta ? 
          <>
            <img src="/ok.png" alt="Ok" style={{ width: 60 }} />
          </>
        :
          <>
            <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
              onClick={excluirProposta} />&nbsp;
            <FaRegEdit className="text-3xl text-yellow-600 inline-block cursor-pointer" title="Responder"
              onClick={responderProposta} />
          </>
        }
      </td>
    </tr>
  )
}

export default ItemProposta
