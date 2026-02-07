import { z } from 'zod';

export const academiaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  latitude: z.number().min(-90).max(90, 'Latitude inválida'),
  longitude: z.number().min(-180).max(180, 'Longitude inválida'),
  raio: z.number().min(1, 'Raio deve ser maior que 0').max(10000, 'Raio máximo é 10000 metros'),
});

export type AcademiaFormData = z.infer<typeof academiaSchema>;
