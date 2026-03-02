import { z } from 'zod';
import { isYouTubeOrVimeoUrl } from '@/lib/video-utils';

const VIDEO_MAX_SIZE = 50 * 1024 * 1024;
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export const videoSourceSchema = z.enum(['file', 'url']);

export const exercicioSchema = z
  .object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().optional(),
    categoriaId: z.string().min(1, 'Categoria é obrigatória'),
    videoSource: videoSourceSchema.default('file'),
    videoFile: z
      .instanceof(File)
      .optional()
      .nullable()
      .refine((file) => !file || file.size <= VIDEO_MAX_SIZE, 'Vídeo deve ter no máximo 50MB')
      .refine((file) => !file || VIDEO_TYPES.includes(file.type), 'Use MP4, WebM ou MOV'),
    videoUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.videoSource === 'file') return data.videoFile instanceof File && data.videoFile.size > 0;
      if (data.videoSource === 'url') return !!data.videoUrl?.trim() && isYouTubeOrVimeoUrl(data.videoUrl.trim());
      return false;
    },
    { message: 'Envie um vídeo (arquivo) ou cole a URL do YouTube ou Vimeo', path: ['videoFile'] }
  )
  .refine(
    (data) => {
      if (data.videoSource !== 'url' || !data.videoUrl?.trim()) return true;
      return isYouTubeOrVimeoUrl(data.videoUrl.trim());
    },
    { message: 'URL deve ser do YouTube ou Vimeo', path: ['videoUrl'] }
  );

export const createExercicioSchema = exercicioSchema;

export const updateExercicioSchema = z
  .object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().optional(),
    categoriaId: z.string().min(1, 'Categoria é obrigatória'),
    videoSource: videoSourceSchema.default('file'),
    videoFile: z
      .instanceof(File)
      .optional()
      .nullable()
      .refine((file) => !file || file.size <= VIDEO_MAX_SIZE, 'Vídeo deve ter no máximo 50MB')
      .refine((file) => !file || VIDEO_TYPES.includes(file.type), 'Use MP4, WebM ou MOV'),
    videoUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.videoSource === 'file' && data.videoFile instanceof File && data.videoFile.size > 0) return true;
      if (data.videoSource === 'url' && data.videoUrl?.trim()) return isYouTubeOrVimeoUrl(data.videoUrl.trim());
      return true;
    },
    { message: 'URL deve ser do YouTube ou Vimeo', path: ['videoUrl'] }
  );

export type ExercicioFormData = z.infer<typeof exercicioSchema>;
export type CreateExercicioFormData = z.infer<typeof createExercicioSchema>;
export type UpdateExercicioFormData = z.infer<typeof updateExercicioSchema>;
