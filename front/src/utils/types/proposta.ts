import { ClienteI } from './cliente';
import { ImovelI } from './imovel';

export interface PropostaI {
  id: number;          // Identificador único da proposta
  clienteId: string;   // Referência ao cliente que fez a proposta
  imovelId: number;    // Referência ao imóvel da proposta
  descricao: string;    // Descrição da proposta
  resposta?: string;   // Resposta do vendedor
  createdAt: Date;     // Data de criação
  updatedAt: Date;     // Data da última atualização
  cliente: ClienteI;   // Relacionamento com o cliente
  imovel: ImovelI;     // Relacionamento com o imóvel
}
