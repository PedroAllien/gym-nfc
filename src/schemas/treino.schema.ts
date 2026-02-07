import { z } from 'zod';

export const treinoExercicioSchema = z.object({
  exercicioId: z.string().min(1, 'Exercício é obrigatório'),
  ordem: z.number().min(1, 'Ordem deve ser maior que 0'),
  series: z.number().min(1).optional(),
  repeticoes: z.string().optional(),
  descanso: z.string().optional(),
  observacao: z.string().optional(),
});

export const treinoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  exercicios: z.array(treinoExercicioSchema).min(1, 'Treino deve ter pelo menos um exercício'),
});

export type TreinoFormData = z.infer<typeof treinoSchema>;
