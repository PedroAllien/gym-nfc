export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercicio {
  id: string;
  nome: string;
  descricao?: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnail: string;
  categoriaId: string;
  categoria: Categoria;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExercicio {
  nome: string;
  descricao?: string;
  youtubeUrl: string;
  categoriaId: string;
}

export interface UpdateExercicio {
  nome?: string;
  descricao?: string;
  youtubeUrl?: string;
  categoriaId?: string;
}
