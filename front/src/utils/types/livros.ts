export interface LivroI {
    id: number;
    titulo: string;
    autor: string;
    paginas: number;
    preco: number;
    sinopse?: string; // Campo opcional
    capa: string;
    destaque: boolean;
    generoId: number;
  }