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
  videoUrl?: string | null;
  externalVideoUrl?: string | null;
  youtubeUrl?: string | null;
  youtubeId?: string | null;
  thumbnail?: string | null;
  categoriaId: string;
  categoria: Categoria;
  createdAt: string;
  updatedAt: string;
}

export type VideoSource = 'file' | 'url';

export interface CreateExercicio {
  nome: string;
  descricao?: string;
  categoriaId: string;
  videoSource: VideoSource;
  videoFile?: File;
  videoUrl?: string;
}

export interface UpdateExercicio {
  nome?: string;
  descricao?: string;
  categoriaId?: string;
  videoSource?: VideoSource;
  videoFile?: File | null;
  videoUrl?: string | null;
}
