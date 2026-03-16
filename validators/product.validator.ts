import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cpg: z.number().positive('Custo por grama deve ser positivo'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  partnerId: z.number().int().positive('Farmácia é obrigatória'),
  unit: z.string().default('mg'),
  desc: z.string().optional().nullable(),
  active: z.boolean().default(true),
  factor: z.number().nullable().optional(),
  doses: z.array(z.number()).optional()
});

export const updateProductSchema = productSchema.partial();

export const productFormSchema = z.object({
  name: z.string().min(1),
  cpg: z.string().transform(val => parseFloat(val)),
  categoryId: z.string().min(1),
  partnerId: z.number().int(),
  unit: z.string().default('mg'),
  desc: z.string().optional(),
  active: z.boolean().optional(),
  factor: z.string().optional().nullable().transform(val => val ? parseFloat(val) : null),
  dosesRaw: z.string().optional().transform(val => 
    val ? val.split(',').map(d => parseFloat(d.trim())).filter(d => !isNaN(d)) : []
  )
});
