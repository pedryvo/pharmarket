import { z } from 'zod';
import { Role } from '@prisma/client';

export const userFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  role: z.nativeEnum(Role),
  phone: z.string().optional().nullable(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export const userUpdateSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  role: z.nativeEnum(Role),
  phone: z.string().optional().nullable(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
});
