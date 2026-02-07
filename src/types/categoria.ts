export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoria {
  nome: string;
  slug: string;
  descricao?: string;
}

export interface UpdateCategoria {
  nome?: string;
  slug?: string;
  descricao?: string;
}
