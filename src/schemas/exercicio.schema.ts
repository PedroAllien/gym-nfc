import { z } from 'zod';

export const exercicioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  youtubeUrl: z
    .string()
    .min(1, 'URL do YouTube é obrigatória')
    .url('URL inválida')
    .refine(
      (url) => /(?:youtube\.com|youtu\.be)/.test(url),
      'URL deve ser do YouTube (vídeo ou shorts)'
    ),
  categoriaId: z.string().min(1, 'Categoria é obrigatória'),
});

export type ExercicioFormData = z.infer<typeof exercicioSchema>;
