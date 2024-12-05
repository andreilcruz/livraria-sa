import { create } from 'zustand';
import { ClienteI } from '@/utils/types/cliente';

type ClienteStore = {
  cliente: ClienteI;
  logaCliente: (clienteLogado: ClienteI) => void;
  deslogaCliente: () => void;
  isAuthenticated: boolean; // Adicionando estado de autenticação
  propostas: number; // Contagem de propostas enviadas pelo cliente
  incrementaPropostas: () => void; // Função para incrementar propostas
}

export const useClienteStore = create<ClienteStore>((set) => ({
  cliente: {} as ClienteI,
  logaCliente: (clienteLogado) => {
    set({ cliente: clienteLogado, isAuthenticated: true });
  },
  deslogaCliente: () => set({ cliente: {} as ClienteI, isAuthenticated: false, propostas: 0 }), // Resetando estado
  isAuthenticated: false, // Estado inicial
  propostas: 0, // Inicializando propostas
  incrementaPropostas: () => set((state) => ({ propostas: state.propostas + 1 })), // Função para incrementar o contador
}));
