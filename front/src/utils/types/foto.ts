export interface FotoI {
  id: number;          // ID único da foto
  descricao: string;   // Descrição da foto
  codigoFoto: string;  // URL ou código da foto
  imovelId: number;    // ID do imóvel associado a esta foto
}
