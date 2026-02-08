export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoria {
  nome: string;
  descricao?: string;
}

export interface UpdateCategoria {
  nome?: string;
  descricao?: string;
}
