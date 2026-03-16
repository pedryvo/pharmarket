import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string().min(1, 'Slug é obrigatório'),
  label: z.string().min(1, 'Rótulo é obrigatório')
});

export const updateCategorySchema = categorySchema.partial();
