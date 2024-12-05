import { TipoI } from "./tipos"; // Assumindo que você tem uma interface TipoI para o tipo do imóvel

export interface ImovelI {
  id: number;          // ID único do imóvel
  endereco: string;    // Endereço do imóvel
  area: number;        // Tamanho do imóvel em metros quadrados
  preco: number;       // Preço do imóvel
  quartos: number;     // Quantidade de quartos
  banheiros: number;   // Quantidade de banheiros
  garagem: boolean;    // Se o imóvel tem garagem
  destaque: boolean;   // Se o imóvel é destacado
  foto: string;        // URL da foto principal do imóvel
  descricao?: string;  // Descrição adicional do imóvel (opcional)
  createdAt: Date;     // Data de criação
  updatedAt: Date;     // Data da última atualização
  tipoId: number;      // ID do tipo do imóvel
  tipo: TipoI;         // Relação com o tipo do imóvel
}
