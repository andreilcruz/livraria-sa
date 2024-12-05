type Proposta = {
  id: number;
  mensagem: string; // Adiciona a propriedade mensagem
  imovel: {
    foto: string;
    endereco: string;
  };
};
