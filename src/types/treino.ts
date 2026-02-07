import { Exercicio } from './exercicio';

export interface TreinoExercicio {
  id: string;
  treinoId: string;
  exercicioId: string;
  ordem: number;
  series?: number;
  repeticoes?: string;
  descanso?: string;
  observacao?: string;
  exercicio: Exercicio;
  createdAt: string;
  updatedAt: string;
}

export interface Treino {
  id: string;
  nome: string;
  descricao?: string;
  exercicios: TreinoExercicio[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreino {
  nome: string;
  descricao?: string;
  exercicios: Array<{
    exercicioId: string;
    ordem: number;
    series?: number;
    repeticoes?: string;
    descanso?: string;
    observacao?: string;
  }>;
}

export interface UpdateTreino {
  nome?: string;
  descricao?: string;
  exercicios?: Array<{
    exercicioId: string;
    ordem: number;
    series?: number;
    repeticoes?: string;
    descanso?: string;
    observacao?: string;
  }>;
}
