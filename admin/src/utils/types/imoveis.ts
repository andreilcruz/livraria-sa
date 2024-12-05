import { TipoI } from "./tipos";

export interface ImovelI {
  id: number;
  endereco: string;
  area: number;
  preco: number;
  destaque: boolean;
  foto: string;
  descricao: string;
  quartos: number;
  banheiros: number;
  tipo: TipoI;
  tipoId: number;
  adminId: number;
}
